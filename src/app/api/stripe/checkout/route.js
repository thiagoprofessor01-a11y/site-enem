import { NextResponse } from "next/server";
import { getStripe, PLANOS_STRIPE } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Cria a sessão de checkout (ASSINATURA) da Stripe para o ALUNO LOGADO.
// O id do aluno vai em client_reference_id e na metadata da assinatura —
// é assim que o webhook libera (renovação/pagamento) e revoga (cancelamento)
// o acesso só para essa pessoa.
export async function POST(req) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "É preciso estar logado para assinar." }, { status: 401 });
  }

  // Plano escolhido no botão (padrão: mensal).
  let planoId = "mensal";
  try {
    const body = await req.json();
    if (body?.plano && PLANOS_STRIPE[body.plano]) planoId = body.plano;
  } catch {
    // sem corpo → usa o padrão
  }
  const plano = PLANOS_STRIPE[planoId];

  const origin = req.headers.get("origin") || new URL(req.url).origin;

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      client_reference_id: user.id,
      customer_email: user.email,
      metadata: { user_id: user.id, plano: planoId },
      subscription_data: {
        metadata: { user_id: user.id, plano: planoId },
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "brl",
            unit_amount: plano.valorCentavos,
            recurring: {
              interval: plano.intervalo,
              interval_count: plano.intervaloContagem,
            },
            product_data: { name: plano.nome },
          },
        },
      ],
      success_url: `${origin}/conteudos?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?checkout=cancelado`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[stripe checkout]", err);
    return NextResponse.json({ error: "Não foi possível iniciar a assinatura." }, { status: 500 });
  }
}

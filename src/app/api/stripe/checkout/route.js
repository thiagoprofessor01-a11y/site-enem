import { NextResponse } from "next/server";
import { getStripe, PRECO_CENTAVOS, PRODUTO_NOME } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Cria a sessão de checkout da Stripe para o ALUNO LOGADO.
// O id do aluno vai em client_reference_id — é assim que o webhook sabe
// quem pagou e libera o acesso só para essa pessoa.
export async function POST(req) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "É preciso estar logado para comprar." }, { status: 401 });
  }

  const origin = req.headers.get("origin") || new URL(req.url).origin;

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      client_reference_id: user.id,
      customer_email: user.email,
      metadata: { user_id: user.id },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "brl",
            unit_amount: PRECO_CENTAVOS,
            product_data: { name: PRODUTO_NOME },
          },
        },
      ],
      success_url: `${origin}/conteudos?pago=1`,
      cancel_url: `${origin}/?checkout=cancelado`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[stripe checkout]", err);
    return NextResponse.json({ error: "Não foi possível iniciar o pagamento." }, { status: 500 });
  }
}

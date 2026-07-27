import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Webhook da Stripe: chamado pela PRÓPRIA Stripe (servidor→servidor) quando
// um pagamento é confirmado. Verifica a assinatura e libera o acesso
// (pago = true) do aluno que pagou. O navegador nunca toca nisso.
export async function POST(req) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get("stripe-signature");
  const body = await req.text(); // corpo cru é obrigatório para validar a assinatura

  let event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    console.error("[stripe webhook] assinatura inválida:", err.message);
    return NextResponse.json({ error: "assinatura inválida" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.client_reference_id || session.metadata?.user_id;

    if (userId && session.payment_status === "paid") {
      try {
        const admin = createAdminClient();
        const { error } = await admin
          .from("profiles")
          .update({ pago: true })
          .eq("id", userId);
        if (error) {
          console.error("[stripe webhook] erro ao liberar acesso:", error);
          return NextResponse.json({ error: "falha ao atualizar profile" }, { status: 500 });
        }
      } catch (err) {
        console.error("[stripe webhook] erro:", err);
        return NextResponse.json({ error: "erro interno" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}

import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Webhook da Stripe: chamado pela PRÓPRIA Stripe (servidor→servidor).
// Verifica a assinatura e mantém o acesso do aluno em dia:
//  - assinatura ativa/renovada → pago = true
//  - assinatura cancelada/expirada → pago = false
// O navegador nunca toca nisso.
export async function POST(req) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get("stripe-signature");
  const body = await req.text(); // corpo cru é obrigatório para validar a assinatura

  const stripe = getStripe();
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    console.error("[stripe webhook] assinatura inválida:", err.message);
    return NextResponse.json({ error: "assinatura inválida" }, { status: 400 });
  }

  // Atualiza o acesso do aluno (libera ou revoga) de forma segura.
  async function definirAcesso(userId, pago) {
    if (!userId) return;
    const admin = createAdminClient();
    const { error } = await admin.from("profiles").update({ pago }).eq("id", userId);
    if (error) {
      console.error("[stripe webhook] erro ao atualizar acesso:", error);
      throw error;
    }
  }

  try {
    switch (event.type) {
      // Primeira assinatura concluída no checkout → libera o acesso.
      case "checkout.session.completed": {
        const session = event.data.object;
        if (session.mode === "subscription") {
          const userId = session.client_reference_id || session.metadata?.user_id;
          await definirAcesso(userId, true);
        }
        break;
      }

      // Renovação paga (todo mês / trimestre) → mantém o acesso liberado.
      case "invoice.paid": {
        const invoice = event.data.object;
        const userId = invoice.subscription_details?.metadata?.user_id;
        if (userId) await definirAcesso(userId, true);
        break;
      }

      // Assinatura cancelada ou expirada → revoga o acesso.
      case "customer.subscription.deleted": {
        const sub = event.data.object;
        const userId = sub.metadata?.user_id;
        await definirAcesso(userId, false);
        break;
      }

      // Assinatura atualizada: revoga se ficou inadimplente/cancelada.
      case "customer.subscription.updated": {
        const sub = event.data.object;
        const userId = sub.metadata?.user_id;
        const ativa = sub.status === "active" || sub.status === "trialing";
        await definirAcesso(userId, ativa);
        break;
      }

      default:
        break;
    }
  } catch {
    return NextResponse.json({ error: "erro interno" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

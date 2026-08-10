import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Webhook do Kiwify: chamado pelo Kiwify quando uma compra muda de status.
// Libera (pago = true) ou revoga (pago = false) o acesso do aluno, casando
// pelo e-mail da compra com a conta no Supabase.
//
// Variáveis de ambiente:
//   KIWIFY_WEBHOOK_TOKEN — o token que você define na config do webhook no Kiwify
//                          (usado para validar a assinatura). Se vazio, não valida.

function assinaturaValida(rawBody, signature, token) {
  if (!token) return true; // sem token configurado → não valida (configure em produção)
  if (!signature) return false;
  const sha1 = crypto.createHmac("sha1", token).update(rawBody).digest("hex");
  const sha256 = crypto.createHmac("sha256", token).update(rawBody).digest("hex");
  return signature === sha1 || signature === sha256;
}

function acharEmail(o) {
  return (
    o?.Customer?.email ||
    o?.customer?.email ||
    o?.buyer?.email ||
    o?.Customer?.Email ||
    o?.email ||
    null
  );
}

export async function POST(req) {
  const raw = await req.text();
  const url = new URL(req.url);
  const signature =
    url.searchParams.get("signature") || req.headers.get("x-kiwify-signature") || "";
  const token = process.env.KIWIFY_WEBHOOK_TOKEN;

  if (!assinaturaValida(raw, signature, token)) {
    console.error("[kiwify webhook] assinatura inválida");
    return NextResponse.json({ error: "assinatura inválida" }, { status: 400 });
  }

  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "json inválido" }, { status: 400 });
  }

  const email = acharEmail(body);
  const status = String(body?.order_status || body?.status || "").toLowerCase();
  const evento = String(body?.webhook_event_type || body?.event || "").toLowerCase();

  const liberar =
    ["paid", "approved", "aprovado", "authorized"].includes(status) ||
    ["order_approved", "order_paid", "subscription_renewed", "compra_aprovada"].includes(evento);
  const revogar =
    ["refunded", "chargedback", "chargeback", "canceled", "cancelled", "refused"].includes(status) ||
    ["order_refunded", "chargeback", "subscription_canceled", "subscription_late"].includes(evento);

  // Nada a fazer (ex.: pix gerado, aguardando pagamento) → apenas confirma.
  if (!email || (!liberar && !revogar)) {
    return NextResponse.json({ received: true, ignored: true });
  }

  try {
    const admin = createAdminClient();
    const { error } = await admin.rpc("liberar_acesso_por_email", {
      p_email: email,
      p_pago: liberar, // true libera; false revoga
    });
    if (error) {
      console.error("[kiwify webhook] erro ao atualizar acesso:", error);
      return NextResponse.json({ error: "falha ao atualizar acesso" }, { status: 500 });
    }
  } catch (err) {
    console.error("[kiwify webhook]", err);
    return NextResponse.json({ error: "erro interno" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

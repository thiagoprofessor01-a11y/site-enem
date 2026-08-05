import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Confirmação na VOLTA do checkout (rede de segurança além do webhook).
// O aluno volta com ?session_id=... ; aqui consultamos a Stripe para ver se
// aquela sessão foi realmente paga e, se sim, liberamos o acesso na hora —
// sem depender do webhook chegar primeiro.
export async function POST(req) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "sem session_id" }, { status: 400 });
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "não autenticado" }, { status: 401 });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const doDono = session.client_reference_id === user.id;
    const pago = session.payment_status === "paid";

    if (pago && doDono) {
      const admin = createAdminClient();
      const { error } = await admin.from("profiles").update({ pago: true }).eq("id", user.id);
      if (error) {
        console.error("[stripe confirm] erro ao liberar:", error);
        return NextResponse.json({ error: "falha ao liberar acesso" }, { status: 500 });
      }
      // Valor e moeda da venda (para o evento de conversão do pixel).
      const valor = session.amount_total != null ? session.amount_total / 100 : null;
      return NextResponse.json({
        ok: true,
        liberado: true,
        valor,
        moeda: (session.currency || "brl").toUpperCase(),
      });
    }

    return NextResponse.json({ ok: true, liberado: false, status: session.payment_status });
  } catch (err) {
    console.error("[stripe confirm]", err);
    return NextResponse.json({ error: "erro ao confirmar" }, { status: 500 });
  }
}

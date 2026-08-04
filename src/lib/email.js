// Envio de e-mail transacional via Resend (API REST — sem dependência extra).
//
// Variáveis de ambiente (configure na Vercel):
//   RESEND_API_KEY  — chave da API do Resend (https://resend.com)
//   EMAIL_FROM      — remetente verificado, ex.: "MeuENEM <no-reply@meuenem.online>"
//
// Se a RESEND_API_KEY não estiver configurada, o envio é ignorado sem quebrar
// o fluxo de pagamento (apenas registra um aviso no log).

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export async function enviarEmail({ para, assunto, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "MeuENEM <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY não configurada — e-mail não enviado.");
    return false;
  }
  if (!para) {
    console.warn("[email] destinatário vazio — e-mail não enviado.");
    return false;
  }

  try {
    const r = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [para], subject: assunto, html }),
    });
    if (!r.ok) {
      console.error("[email] falha ao enviar:", r.status, await r.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] erro:", err);
    return false;
  }
}

// Conteúdo do e-mail de confirmação de pagamento / boas-vindas.
export function emailBoasVindas({ nome, plano } = {}) {
  const primeiro = (nome || "").trim().split(" ")[0];
  const ola = primeiro ? `Olá, ${primeiro}!` : "Olá!";
  const linhaPlano = plano
    ? `<p style="margin:0 0 16px;color:#475569;font-size:15px;line-height:1.6">Plano contratado: <strong>${plano}</strong>.</p>`
    : "";
  const url = "https://meuenem.online/conteudos";

  const assunto = "Pagamento confirmado — bem-vindo(a) ao MeuENEM! 🎉";
  const html = `
  <div style="margin:0;padding:24px;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden">
      <tr>
        <td style="background:#17106f;padding:28px 32px;text-align:center">
          <span style="color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.5px">Meu<span style="color:#00c8ff">ENEM</span></span>
        </td>
      </tr>
      <tr>
        <td style="padding:32px">
          <div style="text-align:center;margin-bottom:8px">
            <span style="display:inline-block;width:56px;height:56px;line-height:56px;border-radius:50%;background:#21b573;color:#ffffff;font-size:28px">&#10003;</span>
          </div>
          <h1 style="margin:12px 0 8px;text-align:center;color:#0f172a;font-size:22px;font-weight:800">Pagamento confirmado!</h1>
          <p style="margin:0 0 16px;color:#475569;font-size:15px;line-height:1.6">${ola}</p>
          <p style="margin:0 0 16px;color:#475569;font-size:15px;line-height:1.6">
            Recebemos o seu pagamento e o seu acesso ao <strong>MeuENEM</strong> já está liberado.
            Agora é só entrar, montar o seu cronograma e começar a estudar com direção.
          </p>
          ${linhaPlano}
          <div style="text-align:center;margin:28px 0">
            <a href="${url}" style="display:inline-block;background:#ffc857;color:#17106f;text-decoration:none;font-weight:800;font-size:16px;padding:14px 28px;border-radius:12px">Acessar a plataforma</a>
          </div>
          <p style="margin:0;color:#94a3b8;font-size:13px;line-height:1.6">
            Você pode cancelar quando quiser pelo seu perfil. Qualquer dúvida, é só responder este e-mail.
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:18px 32px;background:#f8fafc;text-align:center;color:#94a3b8;font-size:12px">
          MeuENEM · sua plataforma completa de estudos para o ENEM
        </td>
      </tr>
    </table>
  </div>`;

  return { assunto, html };
}

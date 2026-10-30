import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

function buildHtml({ header, body, footer }) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>${header}</h2>
      <div>${body}</div>
      <hr />
      <p style="color: #888; font-size: 12px;">
        ${footer}
      </p>
    </div>
  `;
}

export async function sendEmail({
  to,
  toName,
  subject,
  header,
  body,
  footer,
}) {
  
  const apiKey = process.env.API_KEY || process.env.EMAIL_API_KEY || process.env.MAILERSEND_API_KEY;
  if (!apiKey) {
    throw new Error("Chave de API do serviço de e-mail não encontrada no .env (configure EMAIL_API_KEY ou API_KEY).");
  }

  const fromEmail = process.env.EMAIL_FROM || process.env.MAILERSEND_FROM_EMAIL;
  if (!fromEmail) {
    throw new Error("E-mail remetente não configurado no .env (configure EMAIL_FROM).");
  }

  const mailerSend = new MailerSend({ apiKey });

  const sentFrom = new Sender(
    fromEmail,
    process.env.EMAIL_FROM_NAME || "EasyFood"
  );

  const recipients = [new Recipient(to, toName || to)];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject(subject)
    .setHtml(buildHtml({ header, body, footer }))
    .setText(`${header}\n\n${body.replace(/<br\s*\/?>/g, "\n")}\n\n${footer}`);

  try {
    await mailerSend.email.send(emailParams);
    console.log(`[EMAIL] Enviado para ${to} - "${subject}"`);
  } catch (error) {
    // O SDK do MailerSend lança um objeto { headers, body, statusCode } em vez de um Error padrão
    const erroFormatado = error?.body?.message 
      || (error?.body?.errors ? JSON.stringify(error.body.errors) : null)
      || error?.message 
      || (typeof error === "object" ? JSON.stringify(error) : String(error));
    
    throw new Error(erroFormatado);
  }
}

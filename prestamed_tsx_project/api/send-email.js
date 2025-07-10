import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }
  const { to, subject, html } = req.body;
  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>', // Cambia esto por tu remitente verificado
      to: [to],
      subject,
      html,
    });
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

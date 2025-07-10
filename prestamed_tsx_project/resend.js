import { Resend } from 'resend';

const resend = new Resend('re_Cmvh96uW_A1g95mTuYMW8YX91Bj29KPFs');

(async function () {
  const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: ['menanicolas161@gmail.com'],
    subject: 'Hello World',
    html: '<strong>It works!</strong>',
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
})();
export async function handler(event) {
  const code = event.request.codeParameter;
  const name = event.request.userAttributes.given_name;
  const email = event.request.userAttributes.email;
 
  if (event.triggerSource === 'CustomMessage_SignUp') {
    event.response.emailSubject = `Bem-vindo(a) ${name}!`
    event.response.emailMessage = `<h1> Seja muito bem-vindo(a) ${name}<br/><br/>Use este código para confirmar sua conta: ${code}</h1>`;
  }

  if (event.triggerSource === 'CustomMessage_ForgotPassword') {
    event.response.emailSubject = 'Recuperação de Conta';
    event.response.emailMessage = `<h1>Para recuperar a sua conta acesse:</h1><strong>https://dzzytol1hhaht.cloudfront.net/reset/?email=${encodeURIComponent(email)}&code=${code}</strong>`
  }

  return event
}


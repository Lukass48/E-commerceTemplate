export const emailVerificationMessage = (
  name: string,
  verificationUrl: string,
) => `
  <h1>Hola, ${name}</h1>
  <p>Gracias por registrarte en nuestra plataforma. Por favor, verifica tu dirección de correo haciendo clic en el enlace siguiente:</p>
  <a href="${verificationUrl}">Verificar mi email</a>
  <p>Si no solicitaste este registro, puedes ignorar este mensaje.</p>
  <p>Saludos,</p>
  <p>Equipo de Soporte</p>
`;

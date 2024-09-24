import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { emailVerificationMessage } from 'src/sources/email'; // Importa el template de verificación de email

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_APPLICATION_GMAIL,
        pass: process.env.PASSWORD_APPLICATION_GMAIL,
      },
    });
  }

  // Método para enviar el correo de verificación de email
  async sendVerificationEmail(
    to: string,
    subject: string,
    name: string,
    verificationUrl: string,
  ): Promise<void> {
    // Genera el contenido HTML del email usando la plantilla
    const htmlContent = emailVerificationMessage(name, verificationUrl);

    const mailOptions = {
      from: process.env.EMAIL_APPLICATION_GMAIL, // Remitente
      to, // Receptor
      subject, // Asunto del correo
      html: htmlContent, // Contenido del correo
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email enviado: ', info.response);
    } catch (error) {
      console.error('Error enviando email: ', error);
    }
  }
}

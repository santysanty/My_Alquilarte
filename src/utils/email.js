import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Carga las variables de entorno para EMAIL_USER, EMAIL_PASS, etc.

// Configuración del transportador de Nodemailer
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE_PROVIDER || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Función genérica para enviar emails.
 * @param {string} to - Dirección de correo del destinatario.
 * @param {string} subject - Asunto del correo.
 * @param {string} htmlContent - Contenido HTML del correo.
 */
const sendEmail = async (to, subject, htmlContent) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            html: htmlContent,
        };

        await transporter.sendMail(mailOptions);
        console.log(`[NODEMAILER] Correo enviado exitosamente a: ${to}`);
    } catch (error) {
        console.error(`[NODEMAILER] Error al enviar correo a ${to}:`, error);
        throw new Error(`No se pudo enviar el correo a ${to}. Error: ${error.message}`);
    }
};

/**
 * Envía un email de verificación con un enlace y un código.
 * @param {string} userEmail - Email del usuario.
 * @param {string} username - Nombre del usuario.
 * @param {string} verificationCode - Código de verificación.
 */
const sendVerificationEmail = async (userEmail, username, verificationCode) => {
    console.log(`[sendVerificationEmail] Iniciando envío de correo de verificación para: ${userEmail}`);

    const verificationUrl = `${process.env.FRONTEND_URL}/verify?code=${verificationCode}&email=${encodeURIComponent(userEmail)}`;
    console.log(`[sendVerificationEmail] URL de verificación generada: ${verificationUrl}`);

    const subject = 'Verifica tu cuenta para Alquilarte';
    const htmlContent = `
        <p>Hola ${username},</p>
        <p>Gracias por registrarte en <strong>Alquilarte</strong>. Por favor, verifica tu dirección de correo electrónico haciendo clic en el siguiente enlace:</p>
        <p><a href="${verificationUrl}">Verificar mi Cuenta</a></p>
        <p><strong>O copia y pega este enlace en tu navegador:</strong><br>${verificationUrl}</p>
        <p><strong>O ingresá este código directamente en la página de verificación:</strong><br>${verificationCode}</p>
        <p>Este enlace es válido por 1 hora.</p>
        <p>Si no te registraste en Alquilarte, podés ignorar este mensaje.</p>
        <p>Saludos,<br>El equipo de Alquilarte</p>
    `;

    await sendEmail(userEmail, subject, htmlContent);
};

export default sendEmail;
export { sendVerificationEmail };

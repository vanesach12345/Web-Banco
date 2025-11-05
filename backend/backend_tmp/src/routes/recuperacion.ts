import { Router } from 'express';
import sequelize from '../db/connection';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const router = Router();

router.post('/', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ msg: 'Correo requerido' });

  const [user]: any = await sequelize.query(
    'SELECT id_usu FROM Usuario WHERE email = ?',
    { replacements: [email] }
  );

  if (!user.length) return res.status(404).json({ msg: 'Correo no registrado' });

  const token = crypto.randomBytes(20).toString('hex');
  const expira = Date.now() + 10 * 60 * 1000; // 10 minutos

  await sequelize.query(
    'UPDATE Usuario SET token_recuperacion=?, expira_token=? WHERE email=?',
    { replacements: [token, expira, email] }
  );

  const link = `http://localhost:4200/restablecer?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'salinassanchezcristian26@gmail.com',
      pass: 'nkyb krog mkeu ljih'
    }
  });

  await transporter.sendMail({
    from: '"Nova Capital " <TU_CORREO@gmail.com>',
    to: email,
    subject: 'Recupera tu contraseña - Nova Capital',
    html: `
      <div style="font-family:Arial,sans-serif;padding:20px;background:#f7f5ff;border-radius:10px;">
        <h2 style="color:#6a1b9a;">Solicitud de Recuperación</h2>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${link}" style="color:#6a1b9a;font-weight:bold;">${link}</a>
        <p style="font-size:13px;color:#555;">Este enlace expirará en 10 minutos.</p>
      </div>
    `
  });

  res.json({ msg: 'Correo de recuperación enviado con éxito.' });
});

export default router;

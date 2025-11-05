import { Router } from 'express';
import sequelize from '../db/connection';
import bcrypt from 'bcryptjs';

const router = Router();

router.post('/', async (req, res) => {
  const { token, nueva } = req.body;

  if (!token || !nueva) return res.status(400).json({ msg: 'Datos incompletos' });

  const [user]: any = await sequelize.query(
    'SELECT * FROM Usuario WHERE token_recuperacion=? AND expira_token > ?',
    { replacements: [token, Date.now()] }
  );

  if (!user.length) return res.status(400).json({ msg: 'Token inválido o expirado' });

  const hash = bcrypt.hashSync(nueva, 10);

 await sequelize.query(
  'UPDATE Usuario SET contrasena=?, token_recuperacion=NULL, expira_token=NULL WHERE id_usu=?',
  { replacements: [hash, user[0].id_usu] }
);


  res.json({ msg: 'Contraseña actualizada correctamente.' });
});

export default router;

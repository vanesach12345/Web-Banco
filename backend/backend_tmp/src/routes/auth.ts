import { Router } from 'express';
import sequelize from '../db/connection';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password }:{ email?:string; password?:string } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Faltan credenciales' });

  try {
    const [rows]: any = await sequelize.query(
      `SELECT id_usu, nombre, apellido_paterno, email, contrasena, id_rol
         FROM Usuario WHERE email = ? LIMIT 1`,
      { replacements: [email] }
    );

    const user = Array.isArray(rows) ? rows[0] : rows;
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    // Soporta contraseñas en texto (tus inserts) o con bcrypt
    const hash = user.contrasena ?? '';
    const ok = hash.startsWith('$2') ? await bcrypt.compare(password, hash) : (password === hash);
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign(
      { sub: user.id_usu, rol: user.id_rol, email: user.email, nombre: user.nombre },
      process.env.SECRET_KEY as string,
      { expiresIn: '2h' }
    );

    const { contrasena, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (e:any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;

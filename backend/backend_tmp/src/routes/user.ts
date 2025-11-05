import { Router } from 'express';
import { loginUser, newUser } from '../controllers/user';
import sequelize from '../db/connection';

const router = Router();

// 🟢 Crear nuevo usuario
router.post('/', newUser);

// 🟢 Login de usuario
router.post('/login', loginUser);

// 🟣 Obtener datos del cliente por ID de usuario
router.get('/cliente/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows]: any = await sequelize.query(
      `
      SELECT 
        c.id_cliente,
        u.nombre, 
        u.apellido_paterno, 
        u.apellido_materno,
        c.num_cuenta,
        c.saldo,
        c.estado
      FROM Cliente c
      INNER JOIN Usuario u ON c.id_usu = u.id_usu
      WHERE u.id_usu = ?;
      `,
      { replacements: [id] }
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ ok: false, msg: 'Cliente no encontrado' });
    }

    console.log('✅ Datos enviados al frontend:', rows[0]);
    res.json({ ok: true, ...rows[0] });
  } catch (error: any) {
    console.error('❌ Error al obtener datos del cliente:', error);
    res.status(500).json({ ok: false, msg: 'Error interno del servidor' });
  }
});

export default router;

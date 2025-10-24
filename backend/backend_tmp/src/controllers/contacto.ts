import { Request, Response } from 'express';
import sequelize from '../db/connection';

export const agregarContacto = async (req: Request, res: Response) => {
  try {
    const {
      id_cliente,
      nombre_contacto,
      identificacion,
      banco,
      num_cuenta_destino,
      tipo_cuenta,
      correo,
      telefono,
      alias
    } = req.body;

    const [result] = await sequelize.query(
      `CALL tspAgregarContacto(:id_cliente, :nombre_contacto, :identificacion, :banco,
        :num_cuenta_destino, :tipo_cuenta, :correo, :telefono, :alias)`,
      {
        replacements: {
          id_cliente,
          nombre_contacto,
          identificacion,
          banco,
          num_cuenta_destino,
          tipo_cuenta,
          correo,
          telefono,
          alias
        }
      }
    );

    res.json({ ok: true, message: 'Contacto agregado correctamente', data: result });
  } catch (error: any) {
    console.error('❌ Error al agregar contacto:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
};

import { Router } from "express";
import sequelize from "../db/connection";

const router = Router();

/**
 * 🔹 Obtener todos los contactos de un cliente
 * GET /api/contactos/:id_cliente
 */
router.get("/:id_cliente", async (req, res) => {
  try {
    const { id_cliente } = req.params;

    const [rows]: any = await sequelize.query(
      `SELECT id_contacto, nombre_contacto, banco, num_cuenta_destino, tipo_cuenta, alias
       FROM Contacto 
       WHERE id_cliente = ?`,
      { replacements: [id_cliente] }
    );

    res.json(rows);
  } catch (error: any) {
    console.error("❌ Error al obtener contactos:", error.message);
    res.status(500).json({ ok: false, error: "Error al obtener contactos" });
  }
});

/**
 * 🔹 Agregar un nuevo contacto
 * POST /api/contactos/agregar
 */
router.post("/agregar", async (req, res) => {
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
      alias,
    } = req.body;

    console.log("📩 Recibiendo nuevo contacto:", req.body);

    // Validar campos obligatorios
    if (!id_cliente || !nombre_contacto || !banco || !num_cuenta_destino || !tipo_cuenta) {
      return res.status(400).json({ ok: false, msg: "Faltan campos obligatorios" });
    }

    // Insertar contacto
    await sequelize.query(
      `INSERT INTO Contacto 
      (id_cliente, nombre_contacto, identificacion, banco, num_cuenta_destino, tipo_cuenta, correo, telefono, alias)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      {
        replacements: [
          id_cliente,
          nombre_contacto,
          identificacion || null,
          banco,
          num_cuenta_destino,
          tipo_cuenta,
          correo || null,
          telefono || null,
          alias || null,
        ],
      }
    );

    res.json({ ok: true, msg: "✅ Contacto agregado exitosamente" });
  } catch (error: any) {
    console.error("❌ Error al guardar el contacto:", error.message);
    res.status(500).json({ ok: false, error: "Error al guardar el contacto" });
  }
});

export default router;

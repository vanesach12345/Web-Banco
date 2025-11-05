import { Router } from "express";
import sequelize from "../db/connection";

const router = Router();

// 🔹 Obtener movimientos por id de usuario
router.get("/movimientos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows]: any = await sequelize.query(`
      SELECT 
        t.folio,
        t.monto,
        t.iva,
        t.total_final,
        t.id_cuenta_origen,
        t.id_cuenta_destino,
        t.descripcion,
        t.fecha
      FROM Transacciones t
      JOIN Cliente c ON c.num_cuenta = t.id_cuenta_origen OR c.num_cuenta = t.id_cuenta_destino
      WHERE c.id_usu = ?
      ORDER BY t.fecha DESC
      LIMIT 10
    `, { replacements: [id] });

    res.json(rows);
  } catch (error: any) {
    console.error("❌ Error obteniendo movimientos:", error.message);
    res.status(500).json({ error: "Error al obtener movimientos" });
  }
});

export default router;

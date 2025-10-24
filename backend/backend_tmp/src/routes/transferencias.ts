import { Router } from "express";
import sequelize from "../db/connection";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { cuenta_origen, cuenta_destino, monto, tipo_transferencia, descripcion } = req.body;

    // 🧩 Validaciones básicas
    if (!cuenta_origen || !cuenta_destino || monto == null) {
      return res.status(400).json({ ok: false, msg: "Datos incompletos" });
    }

    if (monto <= 0) {
      return res.status(400).json({ ok: false, msg: "El monto debe ser mayor a 0." });
    }

    // 💰 Consultar saldo actual
    const [cliente]: any = await sequelize.query(
      `SELECT saldo FROM Cliente WHERE num_cuenta = ?`,
      { replacements: [cuenta_origen] }
    );

    if (!cliente.length) {
      return res.status(404).json({ ok: false, msg: "Cuenta origen no encontrada." });
    }

    const saldoActual = Number(cliente[0].saldo);

    // ❌ Validar fondos
    if (monto > saldoActual) {
      return res.status(400).json({ ok: false, msg: "Saldo insuficiente para realizar la transferencia." });
    }

    // 🔹 Calcular IVA y demás
    const iva = +(monto * 0.07).toFixed(2);
    const comision = 0;
    const id_tipo_mov = 3;

    // Buscar id_contacto
    const [contacto]: any = await sequelize.query(
      `SELECT id_contacto FROM Contacto WHERE num_cuenta_destino = ? LIMIT 1`,
      { replacements: [cuenta_destino] }
    );

    const id_contacto = contacto?.[0]?.id_contacto || null;

    // 🧾 Insertar la transacción
    const [result]: any = await sequelize.query(
      `INSERT INTO Transacciones 
       (monto, iva, comision, id_tipo_mov, id_tipo_transferencia,
        id_cuenta_origen, id_cuenta_destino, id_contacto, descripcion, fecha)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      {
        replacements: [
          monto,
          iva,
          comision,
          id_tipo_mov,
          tipo_transferencia,
          cuenta_origen,
          cuenta_destino,
          id_contacto,
          descripcion,
        ],
      }
    );

    // 🔹 Actualizar saldo del cliente
    await sequelize.query(
      `UPDATE Cliente SET saldo = saldo - ? WHERE num_cuenta = ?`,
      { replacements: [monto, cuenta_origen] }
    );

    const comprobante = {
      id_transaccion: result,
      fecha: new Date().toISOString(),
      cuenta_origen,
      cuenta_destino,
      monto,
      iva,
      comision,
      descripcion,
    };

    console.log("✅ Transferencia registrada:", comprobante);
    res.json({ ok: true, comprobante });

  } catch (error: any) {
    console.error("❌ Error en transferencia:", error.message);
    res.status(500).json({ ok: false, msg: error.message });
  }
});

export default router;

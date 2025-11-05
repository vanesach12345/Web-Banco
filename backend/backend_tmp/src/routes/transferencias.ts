import { Router } from "express";
import sequelize from "../db/connection";
<<<<<<< HEAD
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
=======
>>>>>>> bdbd8f43011b87f0121304e3b1d8def50cccafdc

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { cuenta_origen, cuenta_destino, monto, tipo_transferencia, descripcion } = req.body;

<<<<<<< HEAD
    //  Validaciones
    if (!cuenta_origen || !cuenta_destino || monto == null) {
      return res.status(400).json({ ok: false, msg: "Datos incompletos." });
    }
=======
    // 🧩 Validaciones básicas
    if (!cuenta_origen || !cuenta_destino || monto == null) {
      return res.status(400).json({ ok: false, msg: "Datos incompletos" });
    }

>>>>>>> bdbd8f43011b87f0121304e3b1d8def50cccafdc
    if (monto <= 0) {
      return res.status(400).json({ ok: false, msg: "El monto debe ser mayor a 0." });
    }

<<<<<<< HEAD
    //  Verificar saldo
    const [cliente]: any = await sequelize.query(
      "SELECT saldo FROM Cliente WHERE num_cuenta = ?",
=======
    // 💰 Consultar saldo actual
    const [cliente]: any = await sequelize.query(
      `SELECT saldo FROM Cliente WHERE num_cuenta = ?`,
>>>>>>> bdbd8f43011b87f0121304e3b1d8def50cccafdc
      { replacements: [cuenta_origen] }
    );

    if (!cliente.length) {
      return res.status(404).json({ ok: false, msg: "Cuenta origen no encontrada." });
    }

    const saldoActual = Number(cliente[0].saldo);
<<<<<<< HEAD
=======

    // ❌ Validar fondos
>>>>>>> bdbd8f43011b87f0121304e3b1d8def50cccafdc
    if (monto > saldoActual) {
      return res.status(400).json({ ok: false, msg: "Saldo insuficiente para realizar la transferencia." });
    }

<<<<<<< HEAD
    // Cálculos
    const iva = +(monto * 0.07).toFixed(2);
    const comision = 0;
    const total = monto + iva + comision;
    const id_tipo_mov = 3;
    const folio = Math.floor(Math.random() * 90000) + 10000;

    //  Insertar transacción
    await sequelize.query(
      `INSERT INTO Transacciones 
        (folio, monto, iva, comision, id_tipo_mov, id_tipo_transferencia,
         id_cuenta_origen, id_cuenta_destino, descripcion, fecha)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      {
        replacements: [
          folio, monto, iva, comision, id_tipo_mov, tipo_transferencia,
          cuenta_origen, cuenta_destino, descripcion
=======
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
>>>>>>> bdbd8f43011b87f0121304e3b1d8def50cccafdc
        ],
      }
    );

<<<<<<< HEAD
    //  Actualizar saldos
    await sequelize.query(
      "UPDATE Cliente SET saldo = saldo - ? WHERE num_cuenta = ?",
      { replacements: [total, cuenta_origen] }
    );
    await sequelize.query(
      "UPDATE Cliente SET saldo = saldo + ? WHERE num_cuenta = ?",
      { replacements: [monto, cuenta_destino] }
    );

    //  Obtener correos y nombres de ambas cuentas
    const [datos]: any = await sequelize.query(
      `
      SELECT 
        u1.email AS email_origen, u1.nombre AS nombre_origen,
        u2.email AS email_destino, u2.nombre AS nombre_destino
      FROM Cliente c1
      JOIN Usuario u1 ON u1.id_usu = c1.id_usu
      JOIN Cliente c2 ON c2.num_cuenta = ?
      JOIN Usuario u2 ON u2.id_usu = c2.id_usu
      WHERE c1.num_cuenta = ?;
      `,
      { replacements: [cuenta_destino, cuenta_origen] }
    );

    const info = datos[0];
    const comprobante = {
      folio,
=======
    // 🔹 Actualizar saldo del cliente
    await sequelize.query(
      `UPDATE Cliente SET saldo = saldo - ? WHERE num_cuenta = ?`,
      { replacements: [monto, cuenta_origen] }
    );

    const comprobante = {
      id_transaccion: result,
>>>>>>> bdbd8f43011b87f0121304e3b1d8def50cccafdc
      fecha: new Date().toISOString(),
      cuenta_origen,
      cuenta_destino,
      monto,
      iva,
<<<<<<< HEAD
      total,
      descripcion,
    };

    //  Generar PDF
    const pdfDir = path.join(__dirname, "../comprobantes");
    if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir);
    const pdfPath = path.join(pdfDir, `Comprobante_${folio}.pdf`);

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(pdfPath));
    doc.fontSize(20).fillColor("#6A0DAD").text("NOVA CAPITAL", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).fillColor("black").text("Comprobante de Transferencia", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Folio: ${folio}`);
    doc.text(`Fecha: ${comprobante.fecha}`);
    doc.text(`Cuenta Origen: ${cuenta_origen} (${info.nombre_origen})`);
    doc.text(`Cuenta Destino: ${cuenta_destino} (${info.nombre_destino})`);
    doc.text(`Monto: $${monto.toFixed(2)}`);
    doc.text(`IVA: $${iva.toFixed(2)}`);
    doc.text(`Total: $${total.toFixed(2)}`);
    doc.text(`Descripción: ${descripcion}`);
    doc.moveDown();
    doc.fillColor("#6A0DAD").text("Gracias por confiar en Nova Capital 💜", { align: "center" });
    doc.end();

    //  Configurar Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "salinassanchezcristian26@gmail.com",
        pass: "twhv bfdx uzvy vlyf",
      },
    });

    //  Email para quien TRANSFIERE
    const correoOrigen = {
      from: '"Nova Capital " <TU_CORREO@gmail.com>',
      to: info.email_origen,
      subject: `✅ Tu transferencia ha sido realizada correctamente - Folio ${folio}`,
      html: `
      <div style="font-family:Arial, sans-serif; background:#f9f6ff; padding:20px;">
        <div style="max-width:600px; margin:auto; background:white; border-radius:10px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.1);">
          <div style="background:linear-gradient(90deg, #4B0082, #9b4de1); color:white; text-align:center; padding:20px;">
            <h2>NOVA CAPITAL </h2>
            <p>Operación Exitosa</p>
          </div>
          <div style="padding:25px;">
            <h3>Hola ${info.nombre_origen},</h3>
            <p>Has realizado una transferencia a <b>${info.nombre_destino}</b> con los siguientes detalles:</p>
            <ul>
              <li><b>Monto enviado:</b> $${monto}</li>
              <li><b>IVA:</b> $${iva}</li>
              <li><b>Total descontado:</b> $${total}</li>
              <li><b>Cuenta destino:</b> ${cuenta_destino}</li>
            </ul>
            <p>Adjunto encontrarás el comprobante en formato PDF.</p>
          </div>
          <div style="background:#4B0082; color:white; text-align:center; padding:10px;">
            <p> Gracias por confiar en Nova Capital </p>
          </div>
        </div>
      </div>`,
      attachments: [{ filename: `Comprobante_${folio}.pdf`, path: pdfPath }],
    };

    //  Email para quien RECIBE
    const correoDestino = {
      from: '"Nova Capital " <TU_CORREO@gmail.com>',
      to: info.email_destino,
      subject: `💰 Has recibido una transferencia - Folio ${folio}`,
      html: `
      <div style="font-family:Arial, sans-serif; background:#f9f6ff; padding:20px;">
        <div style="max-width:600px; margin:auto; background:white; border-radius:10px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.1);">
          <div style="background:linear-gradient(90deg, #4B0082, #9b4de1); color:white; text-align:center; padding:20px;">
            <h2>NOVA CAPITAL </h2>
            <p>Has recibido una transferencia</p>
          </div>
          <div style="padding:25px;">
            <h3>Hola ${info.nombre_destino},</h3>
            <p>Has recibido una transferencia de <b>${info.nombre_origen}</b> con los siguientes detalles:</p>
            <ul>
              <li><b>Monto recibido:</b> $${monto}</li>
              <li><b>IVA:</b> $${iva}</li>
              <li><b>Total:</b> $${total}</li>
              <li><b>Cuenta origen:</b> ${cuenta_origen}</li>
            </ul>
            <p>Adjunto encontrarás el comprobante en formato PDF.</p>
          </div>
          <div style="background:#4B0082; color:white; text-align:center; padding:10px;">
            <p> Gracias por confiar en Nova Capital </p>
          </div>
        </div>
      </div>`,
      attachments: [{ filename: `Comprobante_${folio}.pdf`, path: pdfPath }],
    };

    //  Enviar ambos correos
    await transporter.sendMail(correoOrigen);
    await transporter.sendMail(correoDestino);

    console.log("✅ Correos enviados correctamente:", info.email_origen, info.email_destino);

    res.json({
      ok: true,
      msg: "Transferencia realizada y correos enviados correctamente.",
      comprobante,
    });

  } catch (error: any) {
    console.error("❌ Error en transferencia:", error);
=======
      comision,
      descripcion,
    };

    console.log("✅ Transferencia registrada:", comprobante);
    res.json({ ok: true, comprobante });

  } catch (error: any) {
    console.error("❌ Error en transferencia:", error.message);
>>>>>>> bdbd8f43011b87f0121304e3b1d8def50cccafdc
    res.status(500).json({ ok: false, msg: error.message });
  }
});

export default router;

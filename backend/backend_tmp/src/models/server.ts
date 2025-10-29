import express, { Application } from "express";
import cors from "cors";
import multer from "multer";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Tesseract from "tesseract.js";
import pdf from "pdf-parse";
import sequelize from "../db/connection";
import authRoutes from "../routes/auth";
import userRoutes from "../routes/user";
import contactoRoutes from "../routes/contacto";          
import transferenciasRoutes from "../routes/transferencias"; 
import movimientosRoutes from "../routes/movimientos";



dotenv.config();

class Server {
  private app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT) || 3001;
    this.middlewares();
    this.routes();
  }

  // ==============================
  // 🔧 MIDDLEWARES
  // ==============================
  private middlewares() {
    this.app.use(cors({ origin: "http://localhost:4200", credentials: true }));
    this.app.use(express.json());
  }

  // ==============================
  // 🚀 RUTAS PRINCIPALES
  // ==============================
  private routes() {
    const upload = multer();

    console.log("🛠️ Registrando rutas principales...");

    // 🔹 Rutas externas
    this.app.use("/api/auth", authRoutes);
    this.app.use("/api/users", userRoutes);
    this.app.use("/api/contactos", contactoRoutes);      
    this.app.use("/api/transferencias", transferenciasRoutes); 
    this.app.use("/api", movimientosRoutes);
    

  // Ruta para obtener las transacciones con filtros
this.app.get("/api/transacciones", async (req, res) => {
  try {
    const { tipoMovimiento, numeroCuenta, usuario, fecha } = req.query;

    let query = `SELECT * FROM Transacciones WHERE 1=1`;

    if (tipoMovimiento) {
      query += ` AND tipo_movimiento = '${tipoMovimiento}'`;
    }
    if (numeroCuenta) {
      query += ` AND cuenta_origen = '${numeroCuenta}'`;
    }
    if (usuario) {
      query += ` AND usuario = '${usuario}'`;
    }
    if (fecha) {
      query += ` AND fecha = '${fecha}'`;
    }

    // Realiza la consulta a la base de datos con los filtros
    const [result]: any = await sequelize.query(query);

    if (result.length === 0) {
      return res.status(404).json({ message: "No se encontraron transacciones" });
    }

    console.log("✅ Transacciones obtenidas:", result);
    res.json(result); // Devuelve las transacciones en formato JSON
  } catch (err: any) {
    console.error("❌ Error al obtener las transacciones:", err.message);
    res.status(500).json({ error: "Error al obtener las transacciones" });
  }
});


    // 🔹 OCR (PDF o Imagen)
    this.app.post("/api/ocr", upload.single("file"), async (req, res) => {
      try {
        if (!req.file) return res.status(400).json({ error: "No se envió archivo." });

        const file = req.file;
        let textoExtraido = "";

        if (file.mimetype === "application/pdf") {
          const bufferData: Buffer = Buffer.from(file.buffer);
          const data: any = await (pdf as any)(bufferData);
          textoExtraido = data.text || "";
        } else {
          const bufferData: Buffer = Buffer.from(file.buffer);
          const result: any = await (Tesseract as any).recognize(bufferData, "spa", {
            logger: (m: any) => console.log(m.status, m.progress),
          });
          textoExtraido = result.data.text || "";
        }

        const matchFecha = textoExtraido.match(/\b\d{2}[\/\-\.]\d{2}[\/\-\.]\d{4}\b/);
        const fechaDetectada = matchFecha ? matchFecha[0] : null;
        const posibleDireccion = textoExtraido
          .split("\n")
          .find((l) => /(CALLE|COL\.|AV\.|NUM|CP|Mz|Lt|Fracc|colonia|avenida)/i.test(l));

        res.json({
          success: true,
          texto: textoExtraido,
          fecha: fechaDetectada,
          direccion: posibleDireccion || null,
        });
      } catch (err: any) {
        console.error("❌ Error OCR:", err.message);
        res.status(500).json({ success: false, error: err.message });
      }


      
    });

    // 🔹 Registro de usuario con archivos
    this.app.post(
      "/api/usuarios",
      upload.fields([
        { name: "ine", maxCount: 1 },
        { name: "comprobante_dir", maxCount: 1 },
      ]),
      async (req, res) => {
        try {
          const {
            nombre,
            apellido_paterno,
            apellido_materno,
            fecha_nac,
            cel,
            direccion,
            contrasena,
            rfc,
            email,
          } = req.body;

          const hashedPassword = await bcrypt.hash(contrasena, 10);
          const ine = (req.files as any)?.ine?.[0]?.buffer || null;
          const comprobante = (req.files as any)?.comprobante_dir?.[0]?.buffer || null;

          await sequelize.query(
            `INSERT INTO Usuario 
             (nombre, apellido_paterno, apellido_materno, fecha_nac, cel, direccion, contrasena, ine, comprobante_dir, rfc, email, id_rol)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
            {
              replacements: [
                nombre,
                apellido_paterno,
                apellido_materno,
                fecha_nac || null,
                cel,
                direccion || null,
                hashedPassword,
                ine,
                comprobante,
                rfc,
                email,
              ],
            }
          );

          res.json({ msg: "✅ Usuario registrado correctamente" });
        } catch (err: any) {
          console.error("❌ Error al registrar usuario:", err);
          res.status(500).json({ error: err.message });
        }
      }
    );



    // 🔹 Obtener datos del cliente
    this.app.get("/api/cliente/:id", async (req, res) => {
      const { id } = req.params;
      try {
        const [result]: any = await sequelize.query(
          `
          SELECT 
            u.nombre, 
            u.apellido_paterno, 
            u.apellido_materno, 
            c.num_cuenta,
            c.saldo
          FROM Usuario u
          JOIN Cliente c ON u.id_usu = c.id_usu
          WHERE u.id_usu = ?
          `,
          { replacements: [id] }
        );

        if (!result.length) {
          return res.status(404).json({ error: "Cliente no encontrado" });
        }

        console.log("✅ Datos obtenidos del cliente:", result[0]);
        res.json(result[0]);
      } catch (err: any) {
        console.error("❌ Error al obtener cliente:", err.message);
        res.status(500).json({ error: "Error al obtener cliente" });
      }
    });
  }
  

  // ==============================
  // 🧠 INICIAR SERVIDOR
  // ==============================
  public listen() {
    this.app.listen(this.port, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${this.port}`);
      console.log("🧠 OCR, Usuarios, Contactos y Transferencias listos 🚀");
    });
  }
}

export default Server;

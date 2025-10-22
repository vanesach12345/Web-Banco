<<<<<<< HEAD
import express, { Application } from "express";
import cors from "cors";
import sequelize from "../db/connection";
import multer from "multer";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import axios from "axios";
import authRoutes from "../routes/auth";

dotenv.config();
=======
import express, { Application } from 'express';
import cors from 'cors';
import sequelize from '../db/connection';
import multer from 'multer';
import bcrypt from 'bcryptjs';   // importa bcrypt

import authRoutes from '../routes/auth';
>>>>>>> 7734e7b69d439d07ee577c433058e30a36d2cc37

class Server {
  private app: Application;
  private port: number;
<<<<<<< HEAD
  private hfApiKey: string;

  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT) || 3001;
    this.hfApiKey = process.env.HF_API_KEY || "";

=======

  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT || 3001);
>>>>>>> 7734e7b69d439d07ee577c433058e30a36d2cc37
    this.middlewares();
    this.routes();
  }

  private middlewares() {
<<<<<<< HEAD
    this.app.use(
      cors({
        origin: process.env.CORS_ORIGIN || "http://localhost:4200",
        credentials: true,
      })
    );
    this.app.use(express.json());
    this.app.use("/api/auth", authRoutes);
  }

  private routes() {
    // ✅ Ruta principal
    this.app.get("/", (_req, res) => res.json({ ok: true }));

    // ✅ Prueba de conexión con Hugging Face
    this.app.get("/api/test-hf", async (_req, res) => {
      try {
        console.log("🤖 Probando conexión con Hugging Face...");

        const response = await axios.post(
          "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
          {
            inputs: "Dame una frase corta motivadora sobre tecnología en español.",
          },
          {
            headers: {
              Authorization: `Bearer ${this.hfApiKey}`,
              "Content-Type": "application/json",
            },
          }
        );

        const output =
          response.data[0]?.generated_text ||
          response.data?.generated_text ||
          JSON.stringify(response.data);

        console.log("✅ Hugging Face respondió:", output);
        res.json({ success: true, message: output });
      } catch (error: any) {
        console.error("❌ Error Hugging Face:", error.response?.data || error.message);
        res.status(500).json({
          success: false,
          error: error.response?.data || error.message,
        });
      }
    });

    // ✅ Registro de usuarios + carga de archivos
    const upload = multer();

    this.app.post(
      "/api/usuarios",
      upload.fields([
        { name: "ine", maxCount: 1 },
        { name: "comprobante_dir", maxCount: 1 },
=======
    this.app.use(cors());
    this.app.use(express.json());

    // rutas externas
    this.app.use('/api/auth', authRoutes);

    // permitir conexión desde Angular
    this.app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
  }

  private routes() {
    // Ruta de prueba
    this.app.get('/', (_req, res) => res.json({ ok: true }));

    this.app.get('/api/usuarios', async (_req, res) => {
      try {
        const [rows] = await sequelize.query('SELECT * FROM Usuario');
        res.json(rows);
      } catch (err: any) {
        res.status(500).json({ error: err.message });
      }
    });

    const upload = multer(); // memoria (buffer)
    this.app.post(
      '/api/usuarios',
      upload.fields([
        { name: 'ine', maxCount: 1 },
        { name: 'comprobante_dir', maxCount: 1 },
>>>>>>> 7734e7b69d439d07ee577c433058e30a36d2cc37
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

<<<<<<< HEAD
          if (!rfc || rfc.trim() === "") {
            return res.status(400).json({ error: "El RFC es obligatorio" });
          }

          const hashedPassword = await bcrypt.hash(contrasena, 10);

=======
          if (!rfc || rfc.trim() === '') {
            return res.status(400).json({ error: 'El RFC es obligatorio' });
          }

          //  Encriptamos la contraseña ANTES de guardarla
          const hashedPassword = await bcrypt.hash(contrasena, 10);

          // Manejo de archivos opcionales
>>>>>>> 7734e7b69d439d07ee577c433058e30a36d2cc37
          const ine =
            req.files && (req.files as any).ine
              ? (req.files as any).ine[0].buffer
              : null;
<<<<<<< HEAD

=======
>>>>>>> 7734e7b69d439d07ee577c433058e30a36d2cc37
          const comprobante =
            req.files && (req.files as any).comprobante_dir
              ? (req.files as any).comprobante_dir[0].buffer
              : null;

          const id_rol = 1;

          await sequelize.query(
            `
            INSERT INTO Usuario 
            (nombre, apellido_paterno, apellido_materno, fecha_nac, cel, direccion, contrasena, ine, comprobante_dir, rfc, email, id_rol)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
            {
              replacements: [
                nombre,
                apellido_paterno,
                apellido_materno,
<<<<<<< HEAD
                fecha_nac || null,
                cel,
                direccion || null,
                hashedPassword,
=======
                fecha_nac,
                cel,
                direccion,
                hashedPassword,  //  Guardamos cifrada
>>>>>>> 7734e7b69d439d07ee577c433058e30a36d2cc37
                ine,
                comprobante,
                rfc,
                email,
                id_rol,
              ],
            }
          );

<<<<<<< HEAD
          res.json({ msg: "✅ Usuario registrado correctamente" });
        } catch (err: any) {
          console.error("❌ Error al registrar usuario:", err);
=======
          res.json({ msg: ' Usuario registrado correctamente' });
        } catch (err: any) {
          console.error(err);
>>>>>>> 7734e7b69d439d07ee577c433058e30a36d2cc37
          res.status(500).json({ error: err.message });
        }
      }
    );
  }

  public listen() {
    this.app.listen(this.port, () => {
<<<<<<< HEAD
      console.log(`🚀 Servidor corriendo en el puerto ${this.port}`);
      console.log("✅ DB OK - Conectado a MySQL");
      console.log("🧠 Hugging Face listo para IA gratuita 🚀");
=======
      console.log(`Aplicacion corriendo en el puerto ${this.port}`);
>>>>>>> 7734e7b69d439d07ee577c433058e30a36d2cc37
    });
  }
}

export default Server;

import express, { Application } from 'express';
import cors from 'cors';
import sequelize from '../db/connection';
import multer from 'multer';
import bcrypt from 'bcryptjs';   // importa bcrypt

import authRoutes from '../routes/auth';

class Server {
  private app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT || 3001);
    this.middlewares();
    this.routes();
  }

  private middlewares() {
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

          if (!rfc || rfc.trim() === '') {
            return res.status(400).json({ error: 'El RFC es obligatorio' });
          }

          //  Encriptamos la contraseña ANTES de guardarla
          const hashedPassword = await bcrypt.hash(contrasena, 10);

          // Manejo de archivos opcionales
          const ine =
            req.files && (req.files as any).ine
              ? (req.files as any).ine[0].buffer
              : null;
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
                fecha_nac,
                cel,
                direccion,
                hashedPassword,  //  Guardamos cifrada
                ine,
                comprobante,
                rfc,
                email,
                id_rol,
              ],
            }
          );

          res.json({ msg: ' Usuario registrado correctamente' });
        } catch (err: any) {
          console.error(err);
          res.status(500).json({ error: err.message });
        }
      }
    );
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Aplicacion corriendo en el puerto ${this.port}`);
    });
  }
}

export default Server;

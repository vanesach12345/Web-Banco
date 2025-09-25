import express, { Application } from 'express';
import cors from 'cors';
import sequelize from '../db/connection';


import authRoutes from '../routes/auth';



export default class Server {
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


    this.app.use('/api/auth', authRoutes);
    this.app.use(cors({ origin: 'http://localhost:4200', credentials: true }));

  }

  private routes() {
    // Salud
    this.app.get('/', (_req, res) => res.json({ ok: true }));

    // 🔹 GET: todos los usuarios
    this.app.get('/api/usuarios', async (_req, res) => {
      try {
        // consulta directa a tu tabla "Usuario" en NBanco
        const [rows] = await sequelize.query('SELECT * FROM Usuario');
        res.json(rows);
      } catch (err: any) {
        res.status(500).json({ error: err.message });
      }
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Aplicacion corriendo en el puerto ${this.port}`);
    });
  }
}

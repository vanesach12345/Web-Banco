import 'dotenv/config';
import Server from './models/server';
import sequelize from './db/connection';
import contactoRoutes from './routes/contacto';

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ DB OK - Conectado a MySQL');

    const server = new Server();
    server.listen();

  } catch (e: any) {
    console.error('❌ DB FAIL - Error:', e.message);
    process.exit(1);
  }
})();

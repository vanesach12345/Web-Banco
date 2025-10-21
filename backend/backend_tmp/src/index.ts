import 'dotenv/config';
import Server from './models/server';
import sequelize from './db/connection';

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

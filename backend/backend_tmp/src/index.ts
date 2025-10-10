import 'dotenv/config';
import Server from './models/server';
import sequelize from './db/connection';

(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB OK  Conectado a MySQL');

    new Server().listen(); // una sola instancia
  } catch (e: any) {
    console.error('DB FAIL ❌', e.message);
    process.exit(1);
  }
})();

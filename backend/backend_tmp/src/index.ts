import 'dotenv/config';
import Server from './models/server';
import sequelize from './db/connection';

(async () => {
  try {
    await sequelize.authenticate();
<<<<<<< HEAD
    console.log('✅ DB OK - Conectado a MySQL');

    const server = new Server();
    server.listen();

  } catch (e: any) {
    console.error('❌ DB FAIL - Error:', e.message);
=======
    console.log('DB OK  Conectado a MySQL');

    new Server().listen(); // una sola instancia
  } catch (e: any) {
    console.error('DB FAIL ❌', e.message);
>>>>>>> 7734e7b69d439d07ee577c433058e30a36d2cc37
    process.exit(1);
  }
})();

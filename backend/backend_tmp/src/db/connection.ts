import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
<<<<<<< HEAD
  process.env['DB_NAME'] || 'NBanco',
  process.env['DB_USER'] || 'root',
  process.env['DB_PASS'] || 'straikidstraykids',
  {
    host: process.env['DB_HOST'] || '127.0.0.1',
    port: Number(process.env['DB_PORT']|| 3306),
=======
  process.env.DB_NAME || 'NBanco',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || 'Betocuevas:3',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
>>>>>>> bdbd8f43011b87f0121304e3b1d8def50cccafdc
    dialect: 'mysql',
    logging: false,
  }
);

export default sequelize;

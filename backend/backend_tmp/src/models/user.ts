import { DataTypes } from 'sequelize';
import sequelize from '../db/connection';

export const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, )

export const Usuario = sequelize.define('Usuario', {
  id_usu:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre:       { type: DataTypes.STRING(50) },
  apellido_paterno: { type: DataTypes.STRING(50) },
  apellido_materno: { type: DataTypes.STRING(50) },
  fecha_nac:    { type: DataTypes.DATEONLY },
  cel:          { type: DataTypes.STRING(15) },
  direccion:    { type: DataTypes.STRING(200) },
  contrasena:   { type: DataTypes.STRING(100), allowNull: false },
  ine:          { type: DataTypes.BLOB('long'), allowNull: true },
  comprobante_dir: { type: DataTypes.BLOB('long'), allowNull: true },
  rfc:          { type: DataTypes.STRING(20) },
  email:        { type: DataTypes.STRING(100), allowNull: false, unique: true },
  id_rol:       { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }, // 1 = Cliente
}, {
  tableName: 'Usuario',
  timestamps: false
});

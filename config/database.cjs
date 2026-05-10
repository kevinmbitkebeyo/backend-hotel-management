import { Sequelize } from 'sequelize';
// import dotenv from 'dotenv';
// dotenv.config();
require('dotenv').config();
const sequelize = new Sequelize(process.env.NEON_DATABASE_URL || process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectModule: require('pg'),
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: console.log, // Active les logs SQL (optionnel)
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export default sequelize;
import { Sequelize } from 'sequelize';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();
import pg from 'pg';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);

let sequelize;

if (process.env.NEON_DATABASE_URL || process.env.DATABASE_URL) {
  // Configuration pour Neon
  sequelize = new Sequelize(process.env.NEON_DATABASE_URL || process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectModule: pg,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: console.log
  });
} else {
  // Configuration locale (fallback)
  const config = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../config/config.json'))
  )[process.env.NODE_ENV || 'development'];
  
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
      host: config.host,
      port: config.port || 5432,
      dialect: config.dialect,
      logging: console.log
    }
  );
}

const db = {};

const modelFiles = fs
  .readdirSync(__dirname)
  .filter(
    file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
  );

for (const file of modelFiles) {
  const model = await import(`./${file}`);
  const definedModel = model.default(sequelize, Sequelize.DataTypes);
  db[definedModel.name] = definedModel;
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
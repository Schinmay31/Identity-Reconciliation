import { Sequelize } from "sequelize";

import DOT_ENV from "../config-env";

const {
  DATABASE_NAME,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_HOST,
  DATABASE_PORT = "5432",
  DATABASE_SSL_CA,
  ENABLE_SSL,
} = DOT_ENV;
const enableSSL = ENABLE_SSL === "true";

export const sequelizeInstanceCreation = () => {
  return new Sequelize(
    DATABASE_NAME as string,
    DATABASE_USERNAME as string,
    DATABASE_PASSWORD as string,
    {
      host: DATABASE_HOST,
      dialect: "postgres",
      port: +DATABASE_PORT,
      logging: false,
      pool: {
        max: 100,
        min: 0,
        acquire: 60000,
      },
      timezone: "+05:30",
      ssl: enableSSL,
      dialectOptions: ENABLE_SSL
        ? {
            ssl: {
              require: false,
              rejectUnauthorized: false,
              ca: [DATABASE_SSL_CA],
            },
          }
        : {},
    }
  );
};

const sequelize = sequelizeInstanceCreation();

export const databaseConnection = async () => {
  await sequelize.authenticate();
  if (sequelize) {
    console.log("Database Connected Successfully");
  } else {
    console.error("Something Went Wrong With Database Connection.");
  }
};

export { sequelize };

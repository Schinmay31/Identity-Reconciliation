import { config } from "dotenv";
config({ path: `.env` });

const DOT_ENV = {
  PORT: process.env.PORT,
  DATABASE_NAME: process.env.DATABASE_NAME,
  DATABASE_USERNAME: process.env.DATABASE_USERNAME,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_HOST: process.env.DATABASE_HOST,
  DATABASE_PORT: process.env.DATABASE_PORT,
  DATABASE_SSL_CA: process.env.DATABASE_SSL_CA,
  ENABLE_SSL: process.env.ENABLE_SSL,
};

export default DOT_ENV;

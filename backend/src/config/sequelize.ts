import { Sequelize } from "sequelize";

if (!process.env.DB_HOST || !process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD) {
  throw new Error("Missing one or more required DB environment variables");
}
const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3308,
  database: process.env.DB_NAME ,
  username: process.env.DB_USER ,
  password: process.env.DB_PASSWORD ,
  logging: true, 
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});
// console.log("Sequelize config:", {
//   user: process.env.DB_USER,
//   pass: process.env.DB_PASSWORD,
//   db: process.env.DB_NAME,
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   database: process.env.DB_NAME,
//   environment: process.env
// })
export default sequelize;
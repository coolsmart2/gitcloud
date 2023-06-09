import mysql from 'mysql2/promise';
import dotonv from 'dotenv';

dotonv.config();

export default mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

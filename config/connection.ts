import mysql2, { ConnectionOptions } from 'mysql2/promise';
import { Connection } from 'mysql2/typings/mysql/lib/Connection';
import dotenv from 'dotenv'
import { Pool } from 'mysql2/typings/mysql/lib/Pool';

dotenv.config()

let db_info: ConnectionOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
};

export default mysql2.createPool(db_info);
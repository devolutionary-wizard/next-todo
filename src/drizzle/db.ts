import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER } from "@/utils/get.os.env";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

export const poolConnection = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    multipleStatements: true,
});
export const db = drizzle(poolConnection);

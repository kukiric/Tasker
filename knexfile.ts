import { Config } from "knex";
import "dotenv/config";

module.exports = {
    client: process.env.DB_CLIENT,
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        port: process.env.DB_PORT,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        filename: process.env.DB_DATABASE
    },
    debug: process.env.DB_DEBUG

} as Config;

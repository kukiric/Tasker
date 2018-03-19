import { Config as EnvConfig } from "knex";

interface Config {
    development: EnvConfig;
    staging: EnvConfig;
    production: EnvConfig;
}

const localConfig: Config = {
    development: {
        client: "sqlite3",
        useNullAsDefault: true,
        connection: {
            filename: "./development.db"
        }
    },

    staging: {
        client: "postgresql",
        connection: {
            database: "my_db",
            user: "username",
            password: "password"
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: "knex_migrations"
        }
    },

    production: {
        client: "postgresql",
        connection: {
            database: "my_db",
            user: "username",
            password: "password"
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: "knex_migrations"
        }
    }
};

module.exports = localConfig;
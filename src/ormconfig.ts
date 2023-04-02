import { ConnectionOptions } from 'typeorm';

export default {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: false,
    migrationsRun: true,
    logging: false,
    entities: ["dist/**/*.entity{.ts,.js}"],
    migrations: ["dist/migrations/*.js"],
    cli: { "migrationsDir": "src/migrations" }    
} as ConnectionOptions;
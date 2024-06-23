import { DataSource } from "typeorm";
import OrmEntities from "./orm-entities";
import config from '../../.utils/config';

export const myMigrationSource = new DataSource({
    type: 'postgres',
    host: config.DB.HOST,
    port: config.DB.PORT,
    username: config.DB.USER,
    password: config.DB.USER_PASS,
    database: config.DB.DB_NAME,
    entities: OrmEntities,
    logging: false,
    synchronize: false,
    migrations: ['src/.database/pg/migration/*{.ts,.js}'],
    migrationsRun: true,
  });
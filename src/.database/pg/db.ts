import {DataSource} from "typeorm";
import config from '../../.utils/config'
import OrmEntities from "./orm-entities";


export const myDataSource = new DataSource({
    type: 'postgres',
    host: config.DB.HOST,
    port: config.DB.PORT,
    username: config.DB.USER,
    password: config.DB.USER_PASS,
    database: config.DB.DB_NAME,
    entities: OrmEntities,
    logging: false,
    synchronize: false,
  });
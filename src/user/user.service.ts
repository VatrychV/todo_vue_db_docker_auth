import { EntityManager } from "typeorm/entity-manager/EntityManager";
import { FindOneOptions } from "typeorm/find-options/FindOneOptions";
import { ITodo, IUser } from "../../interfaces/entities.interface";
import Todo from "../.database/pg/.entities/todo.entity";
import User from "../.database/pg/.entities/user.entity";
import { myDataSource } from "../.database/pg/db";
import { logger } from "../.utils/winston.logger";

export namespace UserService {
    export async function findOne(criteria:FindOneOptions<IUser>) {
        return myDataSource.getRepository(User).findOne(criteria)
    }

    export async function  create (manager: EntityManager, email:string, name:string, hash_password:string){
            logger.info(`Creating user for:${email}`,"UserService, create" )
            const user_dto: Partial<IUser> = {name,email, password:hash_password}
            const user = await manager.save(User, manager.create(User, user_dto))

            const todo_dto: Partial<ITodo> = {title:`Hey ${name}, this is your todo!`, descrption:"Click me to complete", user}
            await manager.save(Todo,manager.create(Todo, todo_dto))
            return user
    }
    }

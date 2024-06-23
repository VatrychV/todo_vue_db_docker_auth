import { EntityManager, FindOneOptions } from "typeorm"
import Todo from "../.database/pg/.entities/todo.entity"
import User from "../.database/pg/.entities/user.entity"
import { myDataSource } from "../.database/pg/db"
import { logger } from "../.utils/winston.logger"
import { ITodo, IUser } from "../interfaces/entities.interface"

export namespace UserService {
  export function findOne(criteria: FindOneOptions<IUser>) {
    return myDataSource.getRepository(User).findOne(criteria)
  }
  export function findOneOrFail(criteria: FindOneOptions<IUser>) {
    return myDataSource.getRepository(User).findOneOrFail(criteria)
  }

  export async function create(
    manager: EntityManager,
    email: string,
    name: string,
    hash_password: string
  ) {
    logger.info(`Creating user for:${email}`, "UserService, create")

    const user_dto: Pick<IUser, "name" | "email" | "password"> = {
      name,
      email,
      password: hash_password,
    }
    const user = await manager.save(User, manager.create(User, user_dto))

    const todo_dto: Partial<ITodo> = {
      title: `Hey ${name}, this is your first todo!`,
      description: "Click me to complete",
      user,
    }
    await manager.save(Todo, manager.create(Todo, todo_dto))
    return user
  }
}

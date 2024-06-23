import { Column, Entity, JoinColumn, ManyToOne } from "typeorm"
import { ITodo, IUser } from "../../../interfaces/entities.interface"
import Default from "./default.entity"
import User from "./user.entity"

@Entity()
class Todo extends Default implements ITodo {
  @Column()
  title: string

  @Column("varchar", { nullable: true })
  description: string | null

  @Column({ default: false })
  is_done: boolean

  @ManyToOne(() => User, (user) => user.todos)
  @JoinColumn()
  user: IUser
}

export default Todo

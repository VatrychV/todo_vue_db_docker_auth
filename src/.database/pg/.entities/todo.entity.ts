import { Column, Entity, JoinColumn, ManyToOne } from "typeorm"
import { ITodo } from "../../../../interfaces/entities.interface"
import Default from "./default.entity"
import User from "./user.entity"

@Entity()
class Todo extends Default implements ITodo {
  descrption!: string
  @Column()
    title!: string

  @Column({ nullable: true })
    description!: string 

  @Column({ default: false })
    is_done!: boolean 

  @ManyToOne(() => User, (user) => user.todos)
    @JoinColumn()
    user!: User
}

export default Todo
import { Column, Entity, Index, OneToMany } from "typeorm"
import { ITodo, IUser } from "../../../../interfaces/entities.interface"
import Default from "./default.entity"
import { Exclude } from "class-transformer"
import Todo from "./todo.entity"

@Entity()
class User extends Default implements IUser {

  @Column()
    name!: string

  @Index()
    @Column()
    email!: string

  @Exclude()
    @Column()
    password!: string

  @Exclude()
    @Column({ nullable: true })
    refresh_token!: string


  @OneToMany(() => Todo, (todo) => todo.user)
    todos!: ITodo[]


}

export default User
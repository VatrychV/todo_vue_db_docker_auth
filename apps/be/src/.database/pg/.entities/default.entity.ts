import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { IDefault } from "../../../interfaces/entities.interface"

class Default implements IDefault {
  @PrimaryGeneratedColumn() id: number

  @CreateDateColumn() created_at: Date

  @UpdateDateColumn() updated_at: Date

  @DeleteDateColumn() deleted_at: Date | null
}

export default Default

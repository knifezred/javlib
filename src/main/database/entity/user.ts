import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'varchar', length: 50 })
  firstName?: string

  @Column({ type: 'varchar', length: 50 })
  lastName?: string

  @Column({ type: 'integer' })
  age?: number
}

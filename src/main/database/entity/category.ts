import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'varchar', length: 255 })
  type!: string

  @Column({ type: 'varchar', length: 255 })
  key!: string

  @Column({ type: 'integer' })
  value!: number

  @Column({ type: 'integer', nullable: true })
  createdTime?: number

  @Column({ type: 'integer', nullable: true })
  updatedTime?: number
}

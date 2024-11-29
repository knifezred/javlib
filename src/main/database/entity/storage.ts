import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Storage {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'varchar', length: 255 })
  key!: string

  @Column({ type: 'text' })
  value!: string

  @Column({ type: 'integer', nullable: true })
  createdTime?: number

  @Column({ type: 'integer', nullable: true })
  updatedTime?: number
}

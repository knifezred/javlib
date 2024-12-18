import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class Actress {
  @PrimaryGeneratedColumn()
  id?: number
  @Column({ type: 'integer' })
  createdTime!: number //添加时间
  @UpdateDateColumn({ type: 'integer', nullable: true })
  @Column({ type: 'integer', nullable: true })
  updatedTime?: number
  @Column({ type: 'boolean', nullable: true })
  isDelete?: boolean
  @Column({ type: 'varchar', length: 200 })
  name!: string //姓名
  @Column({ type: 'varchar', length: 500 })
  alias!: string //别名
  @Column({ type: 'varchar', length: 1000 })
  introduction!: string //简介
  @Column({ type: 'varchar', length: 500 })
  avatar!: string //头像
  @Column({ type: 'varchar', length: 500 })
  cover!: string //封面
  @Column({ type: 'varchar', length: 1000 })
  tags!: string //标签
  @Column({ type: 'varchar', length: 255 })
  birthday!: string //生日
  @Column({ type: 'boolean' })
  favorite!: boolean //收藏
  @Column({ type: 'float' })
  score!: number //评分
  @Column({ type: 'float' })
  personalScore: number | undefined //私人评分
  @Column({ type: 'integer' })
  videoCount!: number //影片数量
  @Column({ type: 'float' })
  bust?: number
  @Column({ type: 'float' })
  waist?: number
  @Column({ type: 'float' })
  hip?: number
  @Column({ type: 'float' })
  face?: number
  @Column({ type: 'float' })
  body?: number
  @Column({ type: 'integer' })
  cup?: number
  @Column({ type: 'varchar', length: 255 })
  bodySize?: string
  @Column({ type: 'varchar', length: 255 })
  category?: string
  @Column({ type: 'float', nullable: true })
  bodyHeight?: number
  @Column({ type: 'varchar', length: 255, nullable: true })
  debutDate?: string
}

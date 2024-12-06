import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id!: number
  @Column({ type: 'integer' })
  createdTime!: number //添加时间
  @Column({ type: 'integer', nullable: true })
  updatedTime?: number
  @Column({ type: 'boolean', nullable: true })
  isDelete?: boolean
  @Column({ type: 'varchar', length: 255 })
  uniqueid!: string //唯一标识
  @Column({ type: 'varchar', length: 255 })
  num!: string //番号
  @Column({ type: 'varchar', length: 200 })
  title!: string //中文标题
  @Column({ type: 'varchar', length: 200 })
  originTitle!: string //原始标题
  @Column({ type: 'varchar', length: 1000 })
  introduction!: string //简介
  @Column({ type: 'varchar', length: 500 })
  file!: string //文件路径
  @Column({ type: 'varchar', length: 500 })
  torrent!: string //种子
  @Column({ type: 'varchar', length: 500 })
  cover!: string //封面
  @Column({ type: 'varchar', length: 500 })
  poster!: string //海报
  @Column({ type: 'varchar', length: 1000 })
  tags!: string //标签
  @Column({ type: 'varchar', length: 1000 })
  genres!: string //流派
  @Column({ type: 'varchar', length: 255 })
  studio!: string //厂商
  @Column({ type: 'varchar', length: 255 })
  country!: string //地区
  @Column({ type: 'varchar', length: 500 })
  series!: string //系列
  @Column({ type: 'varchar', length: 500 })
  actress!: string //演员
  @Column({ type: 'varchar', length: 255 })
  director!: string //导演
  @Column({ type: 'integer' })
  year?: number //年份
  @Column({ type: 'varchar', length: 255 })
  releaseTime!: string //上映时间
  @Column({ type: 'integer' })
  viewCount!: number //查看次数
  @Column({ type: 'boolean' })
  favorite!: boolean //收藏
  @Column({ type: 'float' })
  score!: number //评分
  @Column({ type: 'float' })
  personalScore: number | undefined //私人评分
  @Column({ type: 'integer' })
  fileSize!: number //文件大小
}

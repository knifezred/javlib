import { app } from 'electron'
import path from 'path'
import { DataSource } from 'typeorm'
import { Settings } from '../settings'
import { Actress } from './entity/actress'
import { Category } from './entity/category'
import { Movie } from './entity/movie'
import { Storage } from './entity/storage'

const dbPath = path.join(app.getPath('documents'), Settings.SavePath, 'saves', 'db.sqlite')
export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: dbPath,
  entities: [Storage, Movie, Category, Actress],
  synchronize: true,
  logger: 'file',
  logging: true
})

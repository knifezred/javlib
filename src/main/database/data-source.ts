import { is } from '@electron-toolkit/utils'
import { app } from 'electron'
import { DataSource } from 'typeorm'
import { Storage } from './entity/storage'
import { User } from './entity/user'

const dbPath = app.getPath('documents') + '/jav-lib/saves/db.sqlite'
export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: dbPath,
  entities: [Storage, User],
  synchronize: is.dev,
  logger: 'file',
  logging: true
})

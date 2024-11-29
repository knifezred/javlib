import cors from 'cors'
import { app } from 'electron'
import log from 'electron-log'
import express from 'express'
import http from 'http'
import { setupServerApi } from '../database'
import { Settings } from '../settings'
// 创建express http服务器
export function createExpressServer() {
  const server = express()
  const serverDir = app.getAppPath()
  // 设置静态文件目录
  server.use(express.static(serverDir))
  // 解析 JSON 请求体
  server.use(express.json())
  // 解析URL编码的请求体
  server.use(express.urlencoded({ extended: true }))
  // 跨域设置
  const corsOptions = {
    origin: 'http://localhost:5173', // 或者使用通配符 '*' 来允许所有来源
    methods: ['GET', 'POST', 'DELETE', 'PUT'], // 允许的HTTP方法
    preflightContinue: false,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'] // 允许的HTTP头
  }
  server.use('/api', cors(corsOptions))
  // 绑定接口
  setupServerApi(server)
  // 启动服务器
  server.listen(Settings.ServerPort, () => {
    log.info('Server started on port ' + Settings.ServerPort)
  })
  const httpServer = http.createServer(server)
  return httpServer
}

export function closeExpressServer(httpServer: http.Server) {
  try {
    httpServer.close(() => {
      log.info('Http Server closed successfully')
    })
  } catch (error) {
    log.error(error)
  }
}

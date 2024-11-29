import { BrowserWindow, ipcMain } from 'electron'
import log from 'electron-log'
import { autoUpdater } from 'electron-updater'

export function useAutoUpdater(mainWindow: BrowserWindow) {
  autoUpdater.logger = require('electron-log')
  // 设置为 false 以手动触发下载
  autoUpdater.autoDownload = false
  // 开发模式下强制检查更新
  autoUpdater.forceDevUpdateConfig = true
  autoUpdater.on('update-available', () => {
    log.info('发现新版本')
    mainWindow.webContents.send('check-for-update-reply', true)
  })

  autoUpdater.on('update-not-available', (res) => {
    mainWindow.webContents.send('check-for-update-reply', false)
    log.info('没有可更新版本: ' + JSON.stringify(res.version))
  })

  autoUpdater.on('download-progress', (res) => {
    mainWindow.webContents.send('download-update-percent-reply', res.percent)
    log.info('下载监听:' + JSON.stringify(res))
  })

  autoUpdater.on('update-downloaded', () => {
    log.info('下载完成')
    mainWindow.webContents.send('download-update-reply', true)
  })

  ipcMain.on('check-for-update', () => {
    log.info('检查更新')
    autoUpdater.checkForUpdates()
  })

  ipcMain.on('download-update', () => {
    log.info('下载更新')
    autoUpdater.downloadUpdate()
  })

  ipcMain.on('quit-and-install', () => {
    log.info('退出重装')
    autoUpdater.quitAndInstall()
  })
}

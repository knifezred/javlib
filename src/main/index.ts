import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { BrowserWindow, Menu, Tray, app, ipcMain, shell } from 'electron'
import logger from 'electron-log'
import { join } from 'path'
import 'reflect-metadata'
import icon from '../../resources/icon.png?asset'
import { useAutoUpdater } from './service/auto-update'
import { closeExpressServer, createExpressServer } from './service/express-server'
import { Settings } from './settings'
let httpServer
let mainWindow: BrowserWindow
function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    title: Settings.AppTitle + ' v' + app.getVersion(),
    show: false,
    frame: false,
    resizable: true,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    logger.info('app quit')
    app.quit()
  }
})

app.on('before-quit', function () {
  // 停止服务器
  closeExpressServer(httpServer)
})

app.whenReady().then(() => {
  // 创建server
  httpServer = createExpressServer()
  // 检查更新
  useAutoUpdater(mainWindow)
  const tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '恢复窗口',
      click: () => {
        /* 恢复窗口的逻辑 */
        mainWindow.show()
      }
    },
    {
      label: '退出',
      click: () => {
        if (mainWindow.isClosable()) {
          mainWindow.close()
        }
        app.quit()
      }
    }
  ])
  tray.setToolTip(Settings.AppDesc)
  tray.setContextMenu(contextMenu)
})

ipcMain.on('hide-window', () => {
  mainWindow.hide()
})

ipcMain.on('close-window', () => {
  mainWindow.close()
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

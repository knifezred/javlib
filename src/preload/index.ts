import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge } from 'electron'
import fs from 'fs'
import path from 'path'

// Custom APIs for renderer
const api = {
  listDir: async (dirPath: string) => {
    const fileList = [] as Array<string>
    try {
      const files = listFilesRecursively(dirPath)
      files.forEach((file) => {
        fileList.push(file)
      })
    } catch (error) {
      console.log(error)
    }
    return fileList
  },
  readFile: async (path: string) => {
    try {
      const fileData = fs.readFileSync(path, 'utf8')
      return fileData
    } catch (error) {
      console.log(error)
    }
    return ''
  },
  getDirectoryFromPath: (filePath: string) => {
    return path.dirname(filePath)
  },
  getFileStats: (filePath: string) => {
    try {
      const stats = fs.statSync(filePath)
      return stats
    } catch (err) {
      console.error('Error retrieving file stats:', err)
    }
    return null
  }
}

// 递归获取文件
function listFilesRecursively(dir: string, files = [] as Array<string>) {
  const items = fs.readdirSync(dir)

  items.forEach((item) => {
    const fullPath = path.join(dir, item)
    const stats = fs.statSync(fullPath)

    if (stats.isDirectory()) {
      // 如果是目录，则递归调用
      listFilesRecursively(fullPath, files)
    } else {
      // 如果是文件，则添加到文件列表中
      files.push(fullPath)
    }
  })

  return files
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

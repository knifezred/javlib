import { app } from 'electron'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import { Settings } from '../settings'
// 格式化时间戳
export function formatTimestamp(timestamp) {
  // 创建一个Date对象
  const date = new Date(timestamp)

  // 获取年份（四位数）
  const year = date.getFullYear()

  // 获取月份（两位数，01-12）
  const month = String(date.getMonth() + 1).padStart(2, '0')

  // 获取日期（两位数，01-31）
  const day = String(date.getDate()).padStart(2, '0')

  // 获取小时（两位数，00-23）
  const hours = String(date.getHours()).padStart(2, '0')

  // 获取分钟（两位数，00-59）
  const minutes = String(date.getMinutes()).padStart(2, '0')

  // 获取秒数（两位数，00-59）
  const seconds = String(date.getSeconds()).padStart(2, '0')

  // 返回格式化后的字符串
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 递归获取文件
export async function listFilesRecursively(dir: string) {
  var files = [] as string[]
  try {
    const items = await fs.promises.readdir(dir, { recursive: true })
    for (const item of items) {
      const fullPath = path.join(dir, item)
      if (!(await fs.promises.stat(fullPath)).isDirectory()) {
        files.push(fullPath)
      }
    }
  } catch (error) {
    console.log(error)
  }
  return files
}
export async function listAllDirFiles(directories: string[]) {
  var files = [] as string[]
  for (const dir of directories) {
    var newFiles = await listFilesRecursively(dir)
    newFiles.forEach((file) => {
      files.push(file)
    })
  }
  return files
}

export async function readFile(path: string) {
  try {
    const fileData = await fs.promises.readFile(path, 'utf8')
    return fileData
  } catch (error) {
    console.log(error)
  }
  return ''
}
export async function saveFile(file: File) {
  const documentsPath = path.join(app.getPath('documents'), Settings.SavePath, 'upload')
  const filePath = documentsPath + new Date().getTime() + getFileExtension(file.name)
  const arrayBuffer = (await fileArrayToBuffer(file)) as ArrayBuffer
  await fs.promises.writeFile(filePath, new Uint8Array(arrayBuffer))
  return filePath
}

export async function copyFile(source: string, destination: string) {
  if (!fs.existsSync(destination)) {
    if (!fs.existsSync(getFileFolder(destination))) {
      fs.promises.mkdir(getFileFolder(destination), { recursive: true })
    }
    await promisify(fs.copyFile)(source, destination)
  }
}
export async function fileArrayToBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
    reader.readAsArrayBuffer(file)
  })
}

export function getFileExtension(filename: string) {
  const parts = filename.split('.')
  return parts.length > 1 ? '.' + parts.pop() : filename
}

export async function getFileStats(filePath: string) {
  try {
    const stats = await fs.promises.stat(filePath)
    return stats
  } catch (err) {
    console.error('Error retrieving file stats:', err)
  }
  return null
}

export function getFileFolder(filePath: string) {
  return path.dirname(filePath)
}

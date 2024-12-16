import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      listDir(dirPath: string): Array<string>
      readFile(path: string): Promise<string>
      saveFile(file: File): Promise<string>
      deleteFile(filePath: string): Promise<boolean>
      getDirectoryFromPath(path: string): string
      getFileStats(path: string): fs.Stats
    }
  }
}

import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      listDir(dirPath: string): Promise<Array<string>>
      readFile(path: string): Promise<string>
      getDirectoryFromPath(path: string): string
    }
  }
}

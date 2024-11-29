import enUS from './langs/en-US.json'
import zhCN from './langs/zh-CN.json'

const locales: Record<App.I18n.LangType, App.I18n.Schema> = {
  'zh-CN': zhCN,
  'en-US': enUS
}

export default locales

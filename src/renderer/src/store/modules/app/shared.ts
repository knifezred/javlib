import { projectSetting } from '@renderer/settings/projectSetting'
import { localStg } from '@renderer/utils/storage'

export function initProjectSettings() {
  const isProd = import.meta.env.PROD

  // if it is development mode, the theme settings will not be cached, by update `themeSettings` in `src/theme/settings.ts` to update theme settings
  if (!isProd) return projectSetting

  // if it is production mode, the theme settings will be cached in localStorage
  // if want to update theme settings when publish new version, please update `overrideThemeSettings` in `src/theme/settings.ts`

  const settings = localStg.get('projectSettings') || projectSetting
  return settings
}

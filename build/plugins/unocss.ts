import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import presetIcons from '@unocss/preset-icons'
import unocss from '@unocss/vite'
import path from 'node:path'
import process from 'node:process'

export function setupUnocss(viteEnv) {
  const { VITE_ICON_PREFIX, VITE_ICON_LOCAL_PREFIX } = viteEnv

  const localIconPath = path.join(process.cwd(), 'src/renderer/src/assets/svg-icon')

  /** The name of the local icon collection */
  const collectionName = VITE_ICON_LOCAL_PREFIX.replace(`${VITE_ICON_PREFIX}-`, '')

  return unocss({
    presets: [
      presetIcons({
        prefix: `${VITE_ICON_PREFIX}-`,
        scale: 1,
        extraProperties: {
          display: 'inline-block'
        },
        collections: {
          [collectionName]: FileSystemIconLoader(localIconPath, (svg) =>
            svg.replace(/^<svg\s/, '<svg width="1em" height="1em" ')
          )
        },
        warn: true
      })
    ]
  })
}

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import type { PluginOption } from 'vite'
import progress from 'vite-plugin-progress'
import { setupUnocss } from './unocss'
import { setupUnplugin } from './unplugin'

export function setupVitePlugins(viteEnv) {
  const plugins: PluginOption = [
    vue({
      script: {
        defineModel: true
      }
    }),
    vueJsx(),
    setupUnocss(viteEnv),
    ...setupUnplugin(viteEnv),
    progress()
  ]

  return plugins
}

import ElegantVueRouter from '@elegant-router/vue/vite'
import dayjs from 'dayjs'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'path'
import { loadEnv } from 'vite'
import { RouteMeta } from 'vue-router'
import { setupVitePlugins } from './build/plugins'

export default defineConfig((configEnv) => {
  const viteEnv = loadEnv(configEnv.mode, process.cwd())
  const buildTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
  return {
    main: {
      plugins: [externalizeDepsPlugin()]
    },
    preload: {
      plugins: [externalizeDepsPlugin()]
    },
    renderer: {
      resolve: {
        alias: {
          '@renderer': resolve('src/renderer/src'),
          '@main': resolve('src/main/'),
          '@resources': resolve('resources/')
        }
      },
      css: {
        preprocessorOptions: {
          scss: {
            additionalData: `@use "src/renderer/src/styles/scss/global.scss" as *;`
          }
        }
      },
      define: {
        BUILD_TIME: JSON.stringify(buildTime)
      },
      plugins: [
        setupVitePlugins(viteEnv),
        ElegantVueRouter({
          cwd: 'src/renderer',
          pageDir: 'src/renderer/src/views',
          alias: {
            '@renderer': 'src/renderer/src'
          },
          layouts: {
            base: 'src/renderer/src/layouts/base-layout/index.vue',
            blank: 'src/renderer/src/layouts/blank-layout/index.vue'
          },
          routePathTransformer(routeName, routePath) {
            const key = routeName

            if (key === 'login') {
              const modules = ['pwd-login', 'register', 'reset-pwd']

              const moduleReg = modules.join('|')

              return `/login/:module(${moduleReg})?`
            }

            return routePath
          },
          onRouteMetaGen(routeName) {
            const key = routeName

            const constantRoutes = ['login', '403', '404', '500']

            const meta: Partial<RouteMeta> = {
              title: key,
              i18nKey: `route.${key}`
            }

            if (constantRoutes.includes(key)) {
              meta.constant = true
            }

            return meta
          }
        })
      ]
    }
  }
})

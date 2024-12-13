// electron.vite.config.ts
import ElegantVueRouter from "@elegant-router/vue/vite";
import dayjs from "dayjs";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import { resolve } from "path";
import { loadEnv } from "vite";

// build/plugins/index.ts
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import progress from "vite-plugin-progress";

// build/plugins/unocss.ts
import { FileSystemIconLoader } from "@iconify/utils/lib/loader/node-loaders";
import presetIcons from "@unocss/preset-icons";
import unocss from "@unocss/vite";
import path from "node:path";
import process2 from "node:process";
function setupUnocss(viteEnv) {
  const { VITE_ICON_PREFIX, VITE_ICON_LOCAL_PREFIX } = viteEnv;
  const localIconPath = path.join(process2.cwd(), "src/renderer/src/assets/svg-icon");
  const collectionName = VITE_ICON_LOCAL_PREFIX.replace(`${VITE_ICON_PREFIX}-`, "");
  return unocss({
    presets: [
      presetIcons({
        prefix: `${VITE_ICON_PREFIX}-`,
        scale: 1,
        extraProperties: {
          display: "inline-block"
        },
        collections: {
          [collectionName]: FileSystemIconLoader(
            localIconPath,
            (svg) => svg.replace(/^<svg\s/, '<svg width="1em" height="1em" ')
          )
        },
        warn: true
      })
    ]
  });
}

// build/plugins/unplugin.ts
import path2 from "node:path";
import process3 from "node:process";
import { FileSystemIconLoader as FileSystemIconLoader2 } from "unplugin-icons/loaders";
import IconsResolver from "unplugin-icons/resolver";
import Icons from "unplugin-icons/vite";
import { AntDesignVueResolver, NaiveUiResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
function setupUnplugin(viteEnv) {
  const { VITE_ICON_PREFIX, VITE_ICON_LOCAL_PREFIX } = viteEnv;
  const localIconPath = path2.join(process3.cwd(), "src/renderer/src/assets/svg-icon");
  const collectionName = VITE_ICON_LOCAL_PREFIX.replace(`${VITE_ICON_PREFIX}-`, "");
  const plugins = [
    Icons({
      compiler: "vue3",
      customCollections: {
        [collectionName]: FileSystemIconLoader2(
          localIconPath,
          (svg) => svg.replace(/^<svg\s/, '<svg width="1em" height="1em" ')
        )
      },
      scale: 1,
      defaultClass: "inline-block"
    }),
    Components({
      dts: "src/typings/components.d.ts",
      types: [{ from: "vue-router", names: ["RouterLink", "RouterView"] }],
      resolvers: [
        AntDesignVueResolver({
          importStyle: false
        }),
        NaiveUiResolver(),
        IconsResolver({ customCollections: [collectionName], componentPrefix: VITE_ICON_PREFIX })
      ]
    }),
    createSvgIconsPlugin({
      iconDirs: [localIconPath],
      symbolId: `${VITE_ICON_LOCAL_PREFIX}-[dir]-[name]`,
      inject: "body-last",
      customDomId: "__SVG_ICON_LOCAL__"
    })
  ];
  return plugins;
}

// build/plugins/index.ts
function setupVitePlugins(viteEnv) {
  const plugins = [
    vue({
      script: {
        defineModel: true
      }
    }),
    vueJsx(),
    setupUnocss(viteEnv),
    ...setupUnplugin(viteEnv),
    progress()
  ];
  return plugins;
}

// electron.vite.config.ts
var electron_vite_config_default = defineConfig((configEnv) => {
  const viteEnv = loadEnv(configEnv.mode, process.cwd());
  const buildTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
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
          "@renderer": resolve("src/renderer/src"),
          "@main": resolve("src/main/"),
          "@resources": resolve("resources/")
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
          cwd: "src/renderer",
          pageDir: "src/renderer/src/views",
          alias: {
            "@renderer": "src/renderer/src"
          },
          layouts: {
            base: "src/renderer/src/layouts/base-layout/index.vue",
            blank: "src/renderer/src/layouts/blank-layout/index.vue"
          },
          routePathTransformer(routeName, routePath) {
            const key = routeName;
            if (key === "login") {
              const modules = ["pwd-login", "register", "reset-pwd"];
              const moduleReg = modules.join("|");
              return `/login/:module(${moduleReg})?`;
            }
            return routePath;
          },
          onRouteMetaGen(routeName) {
            const key = routeName;
            const constantRoutes = ["login", "403", "404", "500"];
            const meta = {
              title: key,
              i18nKey: `route.${key}`
            };
            if (constantRoutes.includes(key)) {
              meta.constant = true;
            }
            return meta;
          }
        })
      ]
    }
  };
});
export {
  electron_vite_config_default as default
};

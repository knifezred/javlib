<script setup lang="ts">
import { useAppStore } from '@renderer/store/modules/app'
import { useRouteStore } from '@renderer/store/modules/route'
import { useThemeStore } from '@renderer/store/modules/theme'
import { useFullscreen } from '@vueuse/core'
import { computed } from 'vue'
import { useMixMenuContext } from '../../context'
import GlobalBreadcrumb from '../global-breadcrumb/index.vue'
import GlobalLogo from '../global-logo/index.vue'
import HorizontalMenu from '../global-menu/base-menu.vue'
import UserAvatar from './components/user-avatar.vue'

defineOptions({
  name: 'GlobalHeader'
})

interface Props {
  /** Whether to show the logo */
  showLogo?: App.Global.HeaderProps['showLogo']
  /** Whether to show the menu toggler */
  showMenuToggler?: App.Global.HeaderProps['showMenuToggler']
  /** Whether to show the menu */
  showMenu?: App.Global.HeaderProps['showMenu']
}

defineProps<Props>()

const appStore = useAppStore()
const themeStore = useThemeStore()
const routeStore = useRouteStore()
const { toggle } = useFullscreen()
const { menus } = useMixMenuContext()

const headerMenus = computed(() => {
  if (themeStore.layout.mode === 'horizontal') {
    return routeStore.menus
  }

  if (themeStore.layout.mode === 'horizontal-mix') {
    return menus.value
  }

  return []
})
</script>

<template>
  <DarkModeContainer
    class="h-full flex-y-center px-12px shadow-header"
    style="-webkit-app-region: drag">
    <GlobalLogo v-if="showLogo" class="h-full" :style="{ width: themeStore.sider.width + 'px' }" />
    <HorizontalMenu v-if="showMenu" mode="horizontal" :menus="headerMenus" class="px-12px" />
    <div v-else class="h-full flex-y-center flex-1-hidden">
      <MenuToggler
        v-if="showMenuToggler"
        :collapsed="appStore.siderCollapse"
        style="-webkit-app-region: no-drag"
        @click="appStore.toggleSiderCollapse" />
      <GlobalBreadcrumb v-if="!appStore.isMobile" class="ml-12px" />
    </div>
    <div class="h-full flex-y-center justify-end" style="-webkit-app-region: no-drag">
      <!-- <GlobalSearch /> -->
      <LangSwitch
        :lang="appStore.locale"
        :lang-options="appStore.localeOptions"
        @change-lang="appStore.changeLocale" />
      <ThemeSchemaSwitch
        :theme-schema="themeStore.themeScheme"
        :is-dark="themeStore.darkMode"
        @switch="themeStore.toggleThemeScheme" />
      <UserAvatar />
      <WindowMinimize />
      <WindowMaximize @click="toggle" />
      <WindowClose />
    </div>
  </DarkModeContainer>
</template>

<style scoped></style>

<script setup lang="ts">
import type { LayoutMode } from '@renderer/packages/materials'
import { AdminLayout, LAYOUT_SCROLL_EL_ID } from '@renderer/packages/materials'
import { useAppStore } from '@renderer/store/modules/app'
import { useThemeStore } from '@renderer/store/modules/theme'
import { computed } from 'vue'
import { setupMixMenuContext } from '../context'
import GlobalAppBar from '../modules/global-app-bar/index.vue'
import GlobalContent from '../modules/global-content/index.vue'

defineOptions({
  name: 'BlankLayout'
})

const appStore = useAppStore()
const themeStore = useThemeStore()
const { menus } = setupMixMenuContext()

const layoutMode = computed(() => {
  const vertical: LayoutMode = 'vertical'
  const horizontal: LayoutMode = 'horizontal'
  return themeStore.layout.mode.includes(vertical) ? vertical : horizontal
})

const headerPropsConfig: Record<UnionKey.ThemeLayoutMode, App.Global.HeaderProps> = {
  vertical: {
    showLogo: false,
    showMenu: false,
    showMenuToggler: true
  },
  'vertical-mix': {
    showLogo: false,
    showMenu: false,
    showMenuToggler: false
  },
  horizontal: {
    showLogo: true,
    showMenu: true,
    showMenuToggler: false
  },
  'horizontal-mix': {
    showLogo: true,
    showMenu: true,
    showMenuToggler: false
  }
}

const headerProps = computed(() => headerPropsConfig[themeStore.layout.mode])

const siderVisible = computed(() => themeStore.layout.mode !== 'horizontal')

const isVerticalMix = computed(() => themeStore.layout.mode === 'vertical-mix')

const isHorizontalMix = computed(() => themeStore.layout.mode === 'horizontal-mix')

const siderWidth = computed(() => getSiderWidth())

const siderCollapsedWidth = computed(() => getSiderCollapsedWidth())

function getSiderWidth() {
  const { width, mixWidth, mixChildMenuWidth } = themeStore.sider

  let w = isVerticalMix.value || isHorizontalMix.value ? mixWidth : width

  if (isVerticalMix.value && appStore.mixSiderFixed && menus.value.length) {
    w += mixChildMenuWidth
  }

  return w
}

function getSiderCollapsedWidth() {
  const { collapsedWidth, mixCollapsedWidth, mixChildMenuWidth } = themeStore.sider

  let w = isVerticalMix.value || isHorizontalMix.value ? mixCollapsedWidth : collapsedWidth

  if (isVerticalMix.value && appStore.mixSiderFixed && menus.value.length) {
    w += mixChildMenuWidth
  }

  return w
}
</script>

<template>
  <AdminLayout
    v-model:sider-collapse="appStore.siderCollapse"
    :mode="layoutMode"
    :scroll-el-id="LAYOUT_SCROLL_EL_ID"
    :scroll-mode="themeStore.layout.scrollMode"
    :is-mobile="appStore.isMobile"
    :full-content="appStore.fullContent"
    :fixed-top="themeStore.fixedHeaderAndTab"
    :header-height="32"
    :tab-visible="themeStore.tab.visible"
    :tab-height="themeStore.tab.height"
    :content-class="appStore.contentXScrollable ? 'overflow-x-hidden' : ''"
    :sider-visible="siderVisible"
    :sider-width="siderWidth"
    :sider-collapsed-width="siderCollapsedWidth"
    :footer-visible="themeStore.footer.visible"
    :footer-height="themeStore.footer.height"
    :fixed-footer="themeStore.footer.fixed"
    :right-footer="themeStore.footer.right">
    <template #header>
      <GlobalAppBar v-bind="headerProps" />
    </template>
    <GlobalContent :show-padding="false" />
  </AdminLayout>
</template>

<style scoped></style>

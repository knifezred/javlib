<script setup lang="ts">
import { $t } from '@renderer/locales'
import { useAppStore } from '@renderer/store/modules/app'
import ConfigOperation from './modules/config-operation.vue'
import DarkMode from './modules/dark-mode.vue'
import LayoutMode from './modules/layout-mode.vue'
import PageFun from './modules/page-fun.vue'
import ThemeColor from './modules/theme-color.vue'

defineOptions({
  name: 'ThemeDrawer'
})

const appStore = useAppStore()
</script>

<template>
  <NDrawer v-model:show="appStore.themeDrawerVisible" display-directive="show" :width="360">
    <NDrawerContent :title="$t('theme.themeDrawerTitle')" :native-scrollbar="false" closable>
      <DarkMode />
      <LayoutMode />
      <ThemeColor />
      <PageFun />
      <template #footer>
        <ConfigOperation />
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>

<template>
  <NFlex>
    <NCard :bordered="false" class="w-49%">
      <DarkMode />
      <LayoutMode />
      <ThemeColor />
    </NCard>
    <NCard :bordered="false" class="w-49%">
      <PageFun />
      <NButton class="mt-4" type="primary" block @click="saveThemeConfig">
        {{ $t('common.save') }}
      </NButton>
    </NCard>
  </NFlex>
</template>
<script setup lang="ts">
import DarkMode from '@renderer/layouts/modules/theme-drawer/modules/dark-mode.vue'
import LayoutMode from '@renderer/layouts/modules/theme-drawer/modules/layout-mode.vue'
import PageFun from '@renderer/layouts/modules/theme-drawer/modules/page-fun.vue'
import ThemeColor from '@renderer/layouts/modules/theme-drawer/modules/theme-color.vue'
import { $t } from '@renderer/locales'
import { useThemeStore } from '@renderer/store/modules/theme'

defineOptions({
  name: 'ThemeSetting'
})

const themeStore = useThemeStore()

function saveThemeConfig() {
  themeStore.cacheThemeSettings()
  window.$message?.success($t('common.saveSuccess'))
}
</script>

<style scoped></style>

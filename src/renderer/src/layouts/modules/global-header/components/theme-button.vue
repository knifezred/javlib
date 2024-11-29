<script setup lang="ts">
import { $t } from '@renderer/locales'
import { useAppStore } from '@renderer/store/modules/app'

defineOptions({
  name: 'ThemeButton'
})

const appStore = useAppStore()
</script>

<template>
  <ButtonIcon
    icon="majesticons:color-swatch-line"
    :tooltip-content="$t('icon.themeConfig')"
    @click="appStore.openThemeDrawer" />
</template>

<style scoped></style>

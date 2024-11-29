<script setup lang="ts">
import { $t } from '@renderer/locales'

defineOptions({
  name: 'WindowMinimize'
})

function hideWindow() {
  window.electron.ipcRenderer.send('hide-window')
}
</script>

<template>
  <ButtonIcon :tooltip-content="$t('icon.minimize')" @click="hideWindow">
    <icon-ic:round-minimize />
  </ButtonIcon>
</template>

<style scoped></style>

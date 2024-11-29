<script setup lang="ts">
import { $t } from '@renderer/locales'

defineOptions({
  name: 'WindowClose'
})

function closeWindow() {
  window.electron.ipcRenderer.send('close-window')
}
</script>

<template>
  <ButtonIcon :tooltip-content="$t('common.close')" @click="closeWindow">
    <icon-ion:close />
  </ButtonIcon>
</template>

<style scoped></style>

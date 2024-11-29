<script setup lang="ts">
import { $t } from '@renderer/locales'

defineOptions({
  name: 'WindowMaximize'
})
</script>

<template>
  <ButtonIcon :tooltip-content="$t('icon.maximize')">
    <icon-mynaui:maximize />
  </ButtonIcon>
</template>

<style scoped></style>

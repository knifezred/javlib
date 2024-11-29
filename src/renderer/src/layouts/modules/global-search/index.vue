<script lang="ts" setup>
import { $t } from '@renderer/locales'
import { useBoolean } from '@renderer/packages/hooks'
import SearchModal from './components/search-modal.vue'

defineOptions({ name: 'GlobalSearch' })

const { bool: show, toggle } = useBoolean()
</script>

<template>
  <ButtonIcon :tooltip-content="$t('common.search')" @click="toggle">
    <icon-uil-search />
  </ButtonIcon>
  <SearchModal v-model:show="show" />
</template>

<style lang="scss" scoped></style>

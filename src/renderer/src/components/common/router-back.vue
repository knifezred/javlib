<script setup lang="ts">
import { useRouterPush } from '@renderer/hooks/common/router'
import { $t } from '@renderer/locales'

defineOptions({
  name: 'RouterBack'
})
const { routerBack } = useRouterPush()
</script>

<template>
  <ButtonIcon
    :tooltip-content="$t('page.login.common.back')"
    class="h-full flex-y-center"
    style="-webkit-app-region: no-drag"
    @click="routerBack">
    <icon-mynaui:corner-up-left />
  </ButtonIcon>
</template>

<style scoped></style>

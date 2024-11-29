<template>
  <n-result status="404" title="404 资源不存在" description="生活总归带点荒谬">
    <template #footer>
      <n-button @click="goHome">返回主页</n-button>
    </template>
  </n-result>
</template>

<script setup lang="ts">
import { useRouterPush } from '@renderer/hooks/common/router'

const { routerPushByKey } = useRouterPush()

function goHome() {
  routerPushByKey('login', { params: { module: 'pwd-login' } })
}
</script>

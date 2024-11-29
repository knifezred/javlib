<template>
  <n-result status="403" title="403 禁止访问" description="总有些门是对你关闭的">
    <template #footer>
      <n-button @click="goHome">返回主页</n-button>
    </template>
  </n-result>
</template>
<script setup lang="ts">
import { useRouterPush } from '@renderer/hooks/common/router'

const { routerPushByKey } = useRouterPush()

function goHome() {
  routerPushByKey('home')
}
</script>

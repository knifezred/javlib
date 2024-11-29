<template>
  <n-result status="500" title="500 服务器错误" description="服务器出错可能说明该雇更多程序员了">
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

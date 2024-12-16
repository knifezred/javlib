<template>
  <NCard class="ma-0 rd-0 pa-0" :bordered="false" :title="title" closable @close="routerBack">
    <div id="mse"></div>
  </NCard>
</template>

<script setup lang="ts">
import { useRouterPush } from '@renderer/hooks/common/router'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Player from 'xgplayer'
import 'xgplayer/dist/index.min.css'

defineOptions({
  name: 'VideoPlayerPage'
})
const route = useRoute()
const { routerBack } = useRouterPush()
const title = route.query.title as string
onMounted(() => {
  new Player({
    id: 'mse',
    url: route.query.file as string,
    height: '100%',
    width: '100%',
    autoplay: true
  })
})
</script>

<style scoped></style>

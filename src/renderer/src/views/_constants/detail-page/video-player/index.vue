<template>
  <NCard class="ma-0 rd-0 pa-0" :bordered="false" :title="title" closable @close="routerBack">
    <div id="mse"></div>
    <NSpace class="mt-2">
      <NTag
        type="primary"
        class="cursor-pointer pa-4"
        v-for="video in (route.query.file as string).split(',')"
        :key="video"
        @click="playerNextVideo(video)">
        {{ getFileName(video) }}
      </NTag>
    </NSpace>
  </NCard>
</template>

<script setup lang="ts">
import { useRouterPush } from '@renderer/hooks/common/router'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import Player from 'xgplayer'
import 'xgplayer/dist/index.min.css'

defineOptions({
  name: 'VideoPlayerPage'
})
const route = useRoute()
const { routerBack } = useRouterPush()
const title = route.query.title as string
const player = ref<Player>()
function playerNextVideo(video: string) {
  if (player.value != undefined) {
    player.value.src = video
  }
}
function getFileName(filePath: string) {
  return filePath.replace(window.api.getDirectoryFromPath(filePath), '').substring(1)
}
onMounted(() => {
  if (route.query.file?.includes(',')) {
    player.value = new Player({
      id: 'mse',
      url: (route.query.file as string).split(',')[0],
      fluid: true,
      autoplay: true,
      playnext: {
        urlList: (route.query.file as string).split(',').slice(1)
      },
      closeVideoDblclick: true
    })
    player.value.play()
  } else {
    player.value = new Player({
      id: 'mse',
      url: route.query.file as string,
      fluid: true,
      autoplay: true,
      closeVideoDblclick: true
    })
    player.value.currentTime
    player.value.play()
  }
})
</script>

<style scoped></style>

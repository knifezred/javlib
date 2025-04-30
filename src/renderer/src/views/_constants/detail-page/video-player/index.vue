<template>
  <NCard class="ma-0 rd-0 pa-0" :bordered="false" :title="title" closable @close="routerBack">
    <div id="mse"></div>
    <NSpace class="mt-2">
      <NTag
        type="primary"
        class="cursor-pointer pa-4"
        v-for="video in (route.query.file as string).split('|').filter(x => x.length > 0)"
        :key="video"
        @click="playerNextVideo(video)">
        {{ getFileName(video) }}
      </NTag>
    </NSpace>
  </NCard>
</template>

<script setup lang="ts">
import { useRouterPush } from '@renderer/hooks/common/router'
import { useAppStore } from '@renderer/store/modules/app'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Player, { Events } from 'xgplayer'
import 'xgplayer/dist/index.min.css'

defineOptions({
  name: 'VideoPlayerPage'
})
const route = useRoute()
const appStore = useAppStore()
const { routerBack } = useRouterPush()
const title = route.query.title as string
const player = ref<Player>()
function playerNextVideo(video: string) {
  if (player.value != undefined) {
    player.value.src = appStore.projectSettings.serviceUrl + video
  }
}
const movieFiles = ref<Array<string>>([])
function getFileName(filePath: string) {
  return filePath.replace(window.api.getDirectoryFromPath(filePath), '').substring(1)
}

watch(
  () => route.query.file,
  () => {
    updateMovieFiles()
  },
  { immediate: true }
)
function updateMovieFiles() {
  var movieFile = route.query.file as string
  movieFiles.value = movieFile.slice(1).split('|').filter(x => x.length > 0)
}
onMounted(() => {
  updateMovieFiles()
  player.value = new Player({
    id: 'mse',
    url: appStore.projectSettings.serviceUrl + '/' + movieFiles.value[0],
    fluid: true,
    autoplay: true,
    volume: appStore.videoVolume,
    hardwareAcceleration: true,
    closeVideoDblclick: true,
    preloadTime: 30,
    bufferBehind: 60,
    videoBuffer: 1.5,
    cors: true
  })
  player.value.on(Events.VOLUME_CHANGE, () => {
    appStore.videoVolume = player.value?.volume ?? 0
  })
})
</script>

<style scoped></style>

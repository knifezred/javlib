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
    player.value.src = getVideoUrl("/" + video)
  }
}
function getVideoUrl(video: string) {
  console.log(video)
  if (video.endsWith(".strm")) {
    return getStrmUrl(appStore.projectSettings.serviceUrl + video)
  } else {
    return appStore.projectSettings.serviceUrl + video
  }
}
const movieFiles = ref<Array<string>>([])
function getFileName(filePath: string) {
  return filePath.replace(window.api.getDirectoryFromPath(filePath), '').substring(1)
}
/**
 * 同步读取.strm文件并提取媒体URL
 * @param strmUrl .strm文件路径
 * @returns 媒体URL字符串
 */
function getStrmUrl(strmUrl: string): string {
  try {
    // 使用XMLHttpRequest同步读取文件
    const request = new XMLHttpRequest()
    request.open('GET', strmUrl, false) // 同步请求
    request.send(null)

    if (request.status !== 200) {
      throw new Error(`Failed to fetch strm file: ${request.status}`)
    }

    const url = request.responseText

    // 验证URL格式
    if (!url.match(/^https?:\/\//)) {
      throw new Error('Invalid URL format in strm file')
    }

    return url.trim()
  } catch (error) {
    console.error('Error reading strm file:', error)
    throw error
  }
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
  playerNextVideo(movieFiles.value[0])
}
onMounted(() => {
  updateMovieFiles()
  console.log(movieFiles.value[0])
  var video_url = appStore.projectSettings.serviceUrl + "/" + movieFiles.value[0]
  if (movieFiles.value[0].endsWith(".strm")) {
    console.log(video_url)
    video_url = getStrmUrl(video_url)
  }
  player.value = new Player({
    id: 'mse',
    url: video_url,
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

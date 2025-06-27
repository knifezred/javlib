<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Player, { Events } from 'xgplayer'
import { useAppStore } from '@renderer/store/modules/app'
import { useRouterPush } from '@renderer/hooks/common/router'
import 'xgplayer/dist/index.min.css'
import { fetchMoviePagedList, findMovie, updateMovie } from '@renderer/service/api/movie'
import { $t } from '@renderer/locales'

defineOptions({
  name: 'VideoPlayerPage'
})
const route = useRoute()
const appStore = useAppStore()
const { routerBack } = useRouterPush()
const info = ref<Dto.DbMovie>({
  createdTime: '',
  viewCount: 0,
  favorite: false,
  personalScore: undefined,
  uniqueid: '',
  num: '',
  title: '',
  originTitle: '',
  introduction: '',
  file: '',
  torrent: '',
  cover: '',
  poster: '',
  tags: '',
  genres: '',
  studio: '',
  country: '',
  series: '',
  actress: '',
  director: '',
  year: 0,
  releaseTime: '',
  score: 0,
  fileSize: 0
})
const player = ref<Player>()
function playerNextVideo(video: string) {
  if (player.value !== undefined) {
    player.value.src = getVideoUrl(`/${video}`)
  }
}
function getVideoUrl(video: string) {
  console.log(video)
  if (video.endsWith('.strm')) {
    return getStrmUrl(appStore.projectSettings.serviceUrl + video)
  }
  return appStore.projectSettings.serviceUrl + video
}
const movieFiles = ref<Array<string>>([])
/**
 * 同步读取.strm文件并提取媒体URL
 *
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
function setViewed() {
  // 更新播放次数
  info.value.viewCount++
  info.value.viewTime = Date.now()
  updateMovie(info.value)
}
watch(
  () => route.query.num,
  async () => {
    await updateMovieFiles()
  },
  { immediate: true }
)
const relatedMovies = ref<Array<Dto.DbMovie>>([])

async function getRelateMovies() {
  relatedMovies.value = []
  const firstActress = info.value.actress.split('|')[0]
  if (firstActress.length > 0) {
    const searchData: Dto.MovieSearchOption = {
      sort: 'year',
      sortRule: 'DESC',
      actress: info.value.actress.split('|')[0],
      page: 1,
      pageSize: 6,
      folder: null
    }
    const res = await fetchMoviePagedList(searchData)
    if (res.data) {
      res.data.records.forEach(record => {
        if (info.value.num !== record.num && relatedMovies.value.filter(x => x.num !== record.num)) {
          relatedMovies.value.push(record)
        }
      })
    }
  }
  if (info.value.series.trim().length > 0) {
    const seriesRes = await fetchMoviePagedList({
      series: info.value.series,
      page: 1,
      pageSize: 4,
      sort: 'id',
      sortRule: 'DESC',
      folder: null
    })
    if (seriesRes.data) {
      seriesRes.data.records.forEach(record => {
        if (info.value.num !== record.num && relatedMovies.value.filter(x => x.num !== record.num)) {
          relatedMovies.value.push(record)
        }
      })
    }
  }
  if (relatedMovies.value.length === 0) {
    const randRecommond = await fetchMoviePagedList({
      page: 1,
      pageSize: 6,
      sort: 'id',
      sortRule: 'RAND',
      folder: null
    })
    if (randRecommond.data) {
      randRecommond.data.records.forEach(record => {
        if (info.value.num !== record.num && relatedMovies.value.filter(x => x.num !== record.num)) {
          relatedMovies.value.push(record)
        }
      })
    }
  }
}
async function updateMovieFiles() {
  setViewed()
  const response = await findMovie(route.query.num as string)
  if (response.data) {
    info.value = response.data
    movieFiles.value = info.value.file
      .slice(1)
      .split('|')
      .filter(x => x.length > 0)
    playerNextVideo(movieFiles.value[0])
    await getRelateMovies()
  } else {
    window.$message?.warning('找不到视频')
  }
}
function setFavorite() {
  info.value.favorite = !info.value.favorite
  info.value.favoriteTime = Date.now()
  updateMovie(info.value).then(res => {
    if (res.data) {
      window.$message?.success(info.value.favorite ? $t('common.addFavorite') : $t('common.removeFavorite'))
    }
  })
}

function setPersonalScore() {
  updateMovie(info.value).then(res => {
    if (res.data) {
      window.$message?.success($t('common.saveSuccess'))
    }
  })
}

onMounted(async () => {
  await updateMovieFiles()
  let video_url = `${appStore.projectSettings.serviceUrl}/${movieFiles.value[0]}`
  if (movieFiles.value[0].endsWith('.strm')) {
    video_url = getStrmUrl(video_url)
  }
  // 动态计算可用宽度（总宽度 - 推荐栏300px - 间隔24px）
  const containerWidth = window.innerWidth - 116 - 12
  const maxHeight = window.innerHeight - 98 - 12 // 预留顶部导航和底部控制栏空间

  // 计算基础16:9尺寸
  let width = Math.min(containerWidth, (maxHeight / 9) * 16)
  let height = (width / 16) * 9

  // 二次校验防止溢出
  if (height > maxHeight) {
    height = maxHeight
    width = (height / 9) * 16
  }

  player.value = new Player({
    id: 'mse',
    url: video_url,
    playNext: {
      urlList: movieFiles
    },
    width,
    height,
    autoplay: true,
    volume: appStore.videoVolume,
    cssFullscreen: true,
    fullscreen: false,
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

<template>
  <NSpace vertical>
    <!-- 播放器主体 -->
    <NCard
      :bordered="false"
      :title="info?.title"
      class="ma-0 h-auto w-auto pa-0"
      content-style="padding: 0;"
      size="small"
      closable
      @close="routerBack">
      <div id="mse"></div>
      <template #header-extra>
        <span
          class="z-3 inline-block h-8 w-8 cursor-pointer rd-50% pa-1 v-mid color-light hover:bg-primary"
          @click="setFavorite">
          <SvgIcon
            class="ma-auto size-6"
            :class="info?.favorite ? 'color-#F8312F' : 'color-gray'"
            icon="solar:heart-angle-bold"></SvgIcon>
        </span>
        <NRate
          v-model:value="info.personalScore"
          allow-half
          class="h-6 px-2"
          :count="5"
          @update:value="setPersonalScore" />
      </template>
    </NCard>
    <!-- 推荐视频列表 -->
    <NSpace v-if="relatedMovies.length > 1" class="mt-sm">
      <MovieCard
        v-for="movie in relatedMovies"
        :key="movie.num"
        :movie="movie"
        sort="personalScore"></MovieCard>
    </NSpace>
  </NSpace>
</template>

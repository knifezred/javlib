<template>
  <NSpace
    class="pa-0"
    :style="
      'background: url(file:///' +
      info.cover.replaceAll('\\', '/') +
      ');background-repeat: no-repeat;background-size: cover;'
    ">
    <NCard :bordered="false" class="z-3 frosted-glass-container ma-0 rd-0">
      <NFlex class="mb-lg" vertical>
        <n-p>
          <n-button text class="font-size-lg z-3 color-white v-sub" @click="routerBack">
            <n-icon>
              <SvgIcon icon="solar:alt-arrow-left-line-duotone"> </SvgIcon>
            </n-icon>
            <n-text class="inline-block pl-2 color-white hover:color-primary-400">
              {{ $t('route.detail-page_video') }}
            </n-text>
          </n-button>
        </n-p>
      </NFlex>

      <n-grid class="flex z-3" x-gap="12" y-gap="0" :cols="4">
        <n-gi>
          <NCard
            :bordered="false"
            class="w-72 h-102 rd-2xl ml-6"
            content-style="padding: 0;"
            hoverable
            @click="playVideo">
            <template #cover>
              <img
                :src="info.poster"
                class="cursor-pointer rd-xl transition-transform duration-300 hover:transform-scale-120" />
            </template>
          </NCard>
        </n-gi>
        <n-gi :span="3">
          <n-h1 class="my-1 text-white">
            {{ info.title }}
            <n-text class="z-3 w-18 text-xl inline-block color-#F9A11E">{{ info.score }}分</n-text>
          </n-h1>
          <!-- <n-p depth="3" class="my-0 text-lg mx-1">{{ info.originTitle }} </n-p> -->
          <n-p class="my-0">
            <n-text class="z-3 text-lg inline-block mr-1 text-#A4A6A7">
              {{ info.releaseTime }}
            </n-text>
            <n-text
              v-if="info.studio.length > 0"
              class="z-3 text-lg inline-block mx-1 text-#A4A6A7">
              | 厂商：<n-text
                depth="3"
                class="cursor-pointer z-3 text-#A4A6A7 hover:color-primary"
                @click="goCategoryPage(info.studio, 'studio')">
                {{ info.studio }}
              </n-text>
            </n-text>
            <n-text
              v-if="info.director.length > 0"
              class="z-3 text-lg inline-block mx-1 text-#A4A6A7">
              | 导演：{{ info.director }}
            </n-text>
            <n-text class="z-3 text-lg inline-block mx-1 text-#A4A6A7">
              | 大小：
              {{ (info.fileSize / 1000 / 1000 / 1000).toFixed(2) + ' GB' }}
            </n-text>
          </n-p>
          <n-p class="my-sm">
            <CategoryCardGroup type="tag" :keys="info.tags"></CategoryCardGroup>
          </n-p>
          <n-p class="my-xs text-lg text-light"> 剧情简介 </n-p>

          <n-ellipsis
            class="text-#9D9E9F text-lg indent-lg"
            expand-trigger="click"
            line-clamp="4"
            :tooltip="false">
            {{ info.introduction.replace('<![CDATA[', '').replace(']]>', '') }}
          </n-ellipsis>
          <n-space class="mt-2">
            <span
              class="z-3 cursor-pointer inline-block rd-12 w-48 h-14 ml-0 pa-3 text-center color-light bg-primary-600 hover:bg-primary"
              @click="playVideo">
              <SvgIcon class="size-8 mr-2 color-white inline-block" icon="solar:play-bold" />
              立即播放
            </span>
            <span
              class="z-3 cursor-pointer inline-block rd-50% w-14 h-14 pa-3 color-light bg-#404245 hover:bg-primary-300 v-mid"
              @click="setViewed">
              <SvgIcon
                class="size-8 ma-auto"
                :class="info.viewCount > 0 ? 'color-primary' : 'color-white'"
                icon="solar:verified-check-bold">
              </SvgIcon>
            </span>
            <span
              class="z-3 cursor-pointer inline-block rd-50% w-14 h-14 pa-3 color-light bg-#404245 hover:bg-primary v-mid"
              @click="setFavorite">
              <SvgIcon
                class="size-8 ma-auto"
                :class="info.favorite ? 'color-#F8312F' : 'color-white'"
                icon="solar:heart-angle-bold">
              </SvgIcon>
            </span>
            <n-dropdown class="v-mid" trigger="hover" :options="options" @select="dorpDownSelect">
              <span
                class="z-3 cursor-pointer inline-block rd-50% w-14 h-14 pa-3 color-light bg-#404245 hover:bg-primary v-mid">
                <SvgIcon class="size-8 ma-auto" icon="tabler:dots"> </SvgIcon>
              </span>
            </n-dropdown>

            <n-rate
              allow-half
              class="h-14 pa-4"
              v-model:value="info.personalScore"
              :count="5"
              v-on:update:value="setPersonalScore" />
          </n-space>
        </n-gi>
        <n-gi class="z-3 mt-xl ml-6" :span="4">
          <n-h3 depth="3" class="mb-2 mt-xl text-light-9"> 演员列表 </n-h3>
          <n-carousel
            class="z-3"
            slides-per-view="auto"
            :space-between="10"
            :show-dots="false"
            draggable>
            <n-carousel-item
              v-for="actor in actressList"
              :key="actor.name"
              class="w-36"
              style="width: 144px">
              <ActressCard :show-second-title="false" :actress="actor" class="mt-2"> </ActressCard>
            </n-carousel-item>
          </n-carousel>
        </n-gi>
        <n-gi v-if="relatedMovies.length > 0" class="z-3 mt-xl ml-6" :span="4">
          <n-h3 depth="3" class="mb-2 mt-xl text-light-9"> 相关推荐 </n-h3>
          <NSpace>
            <MovieCard v-for="movie in relatedMovies" :key="movie.id" :movie="movie"></MovieCard>
          </NSpace>
        </n-gi>
        <n-gi v-if="seriesMovies.length > 0" class="z-3 mt-xl ml-6" :span="4">
          <n-h3 depth="3" class="mb-2 mt-xl text-light-9"> 同系列影片 </n-h3>
          <NSpace>
            <MovieCard v-for="movie in seriesMovies" :key="movie.id" :movie="movie"></MovieCard>
          </NSpace>
        </n-gi>
        <n-gi v-if="recommendedTagMovies.length > 0" class="z-3 mt-xl ml-6" :span="4">
          <n-h3 depth="3" class="mb-2 mt-xl text-light-9"> 更多 {{ recommendedTag }} 影片</n-h3>
          <NSpace>
            <MovieCard
              v-for="movie in recommendedTagMovies"
              :key="movie.id"
              :movie="movie"></MovieCard>
          </NSpace>
        </n-gi>
      </n-grid>
    </NCard>
  </NSpace>
</template>

<script setup lang="ts">
import { useRouterPush } from '@renderer/hooks/common/router'
import { $t } from '@renderer/locales'
import { fetchActressPagedList } from '@renderer/service/api/actress'
import { fetchMoviePagedList, findMovie, updateMovie } from '@renderer/service/api/movie'
import { findStorage } from '@renderer/service/api/storage'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'VideoDetail'
})

const route = useRoute()
const { routerBack, routerPushByKey } = useRouterPush()

const info = ref<Dto.DbMovie>({
  createdTime: 0,
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

const options = ref([
  {
    label: '编辑信息',
    key: 'modify'
  },
  {
    label: $t('common.delete') + '源文件',
    key: 'delete'
  }
])

function playVideo() {
  findStorage('ext_player').then((res) => {
    if (res.data) {
      window.electron.ipcRenderer.invoke('play-video', res.data.value, info.value.file)
      setViewed()
    }
  })
}

function setViewed() {
  info.value.viewCount++
  // 更新播放次数
  updateMovie(info.value)
}

function setFavorite() {
  info.value.favorite = !info.value.favorite
  updateMovie(info.value).then((res) => {
    if (res.data) {
      window.$message?.success(
        info.value.favorite ? $t('common.addFavorite') : $t('common.removeFavorite')
      )
    }
  })
}

function setPersonalScore() {
  updateMovie(info.value).then((res) => {
    if (res.data) {
      window.$message?.success($t('common.saveSuccess'))
    }
  })
}

function dorpDownSelect(val: string) {
  if (val == 'delete') deleteMovie()
  if (val == 'modify') {
    console.log('modify')
  }
}

function deleteMovie() {
  var files = info.value.file.split(',').filter((x) => x.length > 0)
  files.forEach((file) => {
    window.api.deleteFile(file)
  })
  info.value.isDelete = true
  updateMovie(info.value).then(() => {
    routerBack()
  })
}

function goCategoryPage(item: string, type: string) {
  var queryEntity = {}
  queryEntity[type] = item
  routerPushByKey('detail-page_video-list', {
    query: queryEntity
  })
}

const relatedMovies = ref<Array<Dto.DbMovie>>([])
function getRelatedMovies() {
  fetchMoviePagedList({
    page: 1,
    pageSize: 10,
    sort: 'id',
    sortRule: 'RAND'
  }).then((res) => {
    if (res.data) {
      relatedMovies.value = res.data.records.filter((x) => x.num != info.value.num)
    }
  })
}

const seriesMovies = ref<Array<Dto.DbMovie>>([])
function getSeriesMovies() {
  fetchMoviePagedList({
    series: info.value.series,
    page: 1,
    pageSize: 10,
    sort: 'id',
    sortRule: 'RAND'
  }).then((res) => {
    if (res.data) {
      seriesMovies.value = res.data.records.filter((x) => x.num != info.value.num)
    }
  })
}

const recommendedTag = ref('')
const recommendedTagMovies = ref<Array<Dto.DbMovie>>([])
function getRecommendedTagMovies() {
  fetchMoviePagedList({
    tags: [recommendedTag.value],
    page: 1,
    pageSize: 10,
    sort: 'id',
    sortRule: 'RAND'
  }).then((res) => {
    if (res.data) {
      recommendedTagMovies.value = res.data.records.filter((x) => x.num != info.value.num)
    }
  })
}
watch(
  () => route.query,
  () => {
    loadMovieInfo()
  }
)
function loadMovieInfo() {
  findMovie(route.query.num as string).then((res) => {
    if (res.data != null) {
      info.value = res.data
      fetchActressPagedList({
        page: 1,
        pageSize: 100,
        name: res.data.actress,
        sort: 'name',
        sortRule: 'DESC'
      }).then((act) => {
        actressList.value = []
        if (act.data != null) {
          var actressArray = info.value.actress.split('|').filter((x) => x.length > 0)
          for (const element of actressArray) {
            var temp = act.data.records.find((x) => x.name == element)
            if (temp) {
              actressList.value.push(temp)
            }
          }
        }
      })
      getRelatedMovies()
      getSeriesMovies()
      recommendedTag.value = info.value.tags.split('|').filter((x) => x.length > 0)[0]
      getRecommendedTagMovies()
    }
  })
}
const actressList = ref<Array<Dto.DbActress>>([])
onMounted(() => {
  loadMovieInfo()
})
</script>

<style scoped>
.frosted-glass-container {
  position: relative;
  width: 100%;
  border: 0px;
  background: rgba(0, 0, 0, 0.6); /* 半透明背景 */
  backdrop-filter: blur(60px); /* 模糊背景 */
  -webkit-backdrop-filter: blur(30px); /* 兼容Safari */
}
</style>

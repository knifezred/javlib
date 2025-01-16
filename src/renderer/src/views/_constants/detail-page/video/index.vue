<template>
  <NSpace
    class="pa-0"
    :style="'background: url(' + appStore.projectSettings.serviceUrl +
      info.cover.replaceAll('\\', '/') +
      ');background-repeat: no-repeat;background-size: cover;'
      ">
    <div ref="targetElement">
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

        <n-grid class="flex z-3" x-gap="12" y-gap="0" :cols="5">
          <n-gi>
            <NCard
              :bordered="false"
              class="w-72 h-102 rd-2xl ml-6"
              content-style="padding: 0;"
              hoverable
              @click="playVideo">
              <template #cover>
                <img
                  :src="appStore.projectSettings.serviceUrl + info.poster"
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
              {{ info.introduction }}
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
          <n-gi></n-gi>
          <n-gi class="z-3 mt-xl ml-6" :span="5">
            <n-h3 depth="3" class="mb-2 mt-xl text-light-9"> 演员列表 </n-h3>
            <ActressCard v-if="actressList.length == 1" :show-second-title="false" :actress="actressList[0]"
              sort="score"
              class="mt-2">
            </ActressCard>
            <n-carousel v-else
              class="z-3"
              slides-per-view="auto"
              :space-between="10"
              :show-dots="false"
              draggable>
              <n-carousel-item
                v-for="actor in actressList"
                :key="actor.name"
                style="width: 10rem">
                <ActressCard :show-second-title="false" :actress="actor" sort="score" class="mt-2">
                </ActressCard>
              </n-carousel-item>
            </n-carousel>
          </n-gi>
          <n-gi v-if="relatedMovies.length > 0" class="z-3 mt-xl ml-6" :span="5">
            <n-h3 depth="3" class="mb-2 mt-xl text-light-9"> 推荐影片 </n-h3>
            <NSpace>
              <MovieCard
                v-for="movie in relatedMovies"
                :key="movie.id"
                :movie="movie"
                sort="score"></MovieCard>
            </NSpace>
          </n-gi>
          <n-gi v-if="seriesMovies.length > 0" class="z-3 mt-xl ml-6" :span="5">
            <n-h3 depth="3" class="mb-2 mt-xl text-light-9 cursor-pointer"
              @click="goCategoryPage(info.series, 'series')">
              {{ '同系列 ' + info.series + ' 影片' }}
            </n-h3>
            <NSpace>
              <MovieCard
                v-for="movie in seriesMovies"
                :key="movie.id"
                :movie="movie"
                sort="score"></MovieCard>
            </NSpace>
          </n-gi>
          <n-gi v-if="recommendedTagMovies.length > 0" class="z-3 mt-xl ml-6" :span="5">
            <n-h3 depth="3" class="mb-2 mt-xl text-light-9 cursor-pointer"
              @click="goTagsPage(recommendedTag)">
              更多 {{ recommendedTag }} 影片
            </n-h3>
            <NSpace>
              <MovieCard
                v-for="movie in recommendedTagMovies"
                :key="movie.id"
                :movie="movie"
                sort="score"></MovieCard>
            </NSpace>
          </n-gi>
        </n-grid>


        <n-drawer v-model:show="active" :width="600" placement="right" close-on-esc>
          <n-drawer-content :title="info.title">
            <NForm label-placement="left" label-width="100">
              <n-form-item label="标题">
                <n-input v-model:value="info.title" />
              </n-form-item>
              <n-form-item label="简介">
                <n-input type="textarea" v-model:value="info.introduction" />
              </n-form-item>
              <n-form-item label="媒体评分">
                <n-input-number v-model:value="info.score" />
              </n-form-item>
              <n-form-item label="个人评分">
                <n-rate
                  allow-half
                  v-model:value="info.personalScore"
                  :count="5" />
              </n-form-item>
              <n-form-item label="标签">
                <n-dynamic-tags v-model:value="movieTags" />
              </n-form-item>
              <n-form-item label="系列">
                <n-input v-model:value="info.series" />
              </n-form-item>
              <n-form-item label="厂商">
                <n-input v-model:value="info.studio" />
              </n-form-item>
              <n-form-item label="导演">
                <n-input v-model:value="info.director" />
              </n-form-item>
              <n-form-item label="文件">
                <n-input v-model:value="info.file" />
              </n-form-item>
              <n-form-item label="年份">
                <n-input-number v-model:value="info.year" />
              </n-form-item>
              <n-form-item>
                <NButton type="primary" class="ma-auto" @click="saveMovieInfo">{{ $t('common.save') }}</NButton>
              </n-form-item>
            </NForm>
          </n-drawer-content>
        </n-drawer>
      </NCard>
    </div>
  </NSpace>
</template>

<script setup lang="ts">
import { useRouterPush } from '@renderer/hooks/common/router'
import { $t } from '@renderer/locales'
import { fetchActressPagedList } from '@renderer/service/api/actress'
import { deleteMovie, fetchMoviePagedList, findMovie, updateMovie } from '@renderer/service/api/movie'
import { findStorage } from '@renderer/service/api/storage'
import { useAppStore } from '@renderer/store/modules/app'
import { NForm } from 'naive-ui'
import { nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'VideoDetail'
})

const appStore = useAppStore()
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
  fileSize: 0,
  favoriteTime: 0
})

const options = ref([
  {
    label: '编辑信息',
    key: 'modify'
  },
  {
    label: '重新识别',
    key: 'reScraping'
  },
  {
    label: $t('common.delete') + '源文件',
    key: 'delete'
  }
])

function playVideo() {
  findStorage('ext_player').then((res) => {
    setViewed()
    if (res.data && res.data.value.length > 0) {
      window.electron.ipcRenderer.invoke('play-video', res.data.value, info.value.file)
    } else {
      routerPushByKey('detail-page_video-player', {
        query: {
          file: info.value.file,
          title: info.value.title
        }
      })
    }
  })
}

function setViewed() {
  // 更新播放次数
  info.value.viewCount++
  info.value.viewTime = Date.now()
  updateMovie(info.value)
}

function setFavorite() {
  info.value.favorite = !info.value.favorite
  info.value.favoriteTime = Date.now()
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

const active = ref(false)
const movieTags = ref<Array<string>>([])
function dorpDownSelect(val: string) {
  if (val == 'delete') {
    deleteMovie(info.value).then(() => {
      routerBack()
    })
  }
  if (val == 'modify') {
    active.value = true
    movieTags.value = info.value.tags.split("|").filter(x => x.length > 0)
  }
  if (val == 'reScraping') {
    window.$message?.info('敬请期待')
  }
}

function saveMovieInfo() {
  info.value.tags = '|' + movieTags.value.join("|") + '|'
  updateMovie(info.value).then(() => {
    window.$message?.success($t('common.saveSuccess'))
    active.value = false
  })
}

function goCategoryPage(item: string, type: string) {
  var queryEntity = {}
  queryEntity[type] = item
  routerPushByKey('detail-page_video-list', {
    query: queryEntity
  })
}

function goTagsPage(key: string) {
  routerPushByKey('detail-page_video-list', {
    query: {
      key: key,
      type: 'tag'
    }
  })
}

const relatedMovies = ref<Array<Dto.DbMovie>>([])
function getRelatedMovies() {
  fetchMoviePagedList({
    page: 1,
    pageSize: 7,
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
  seriesMovies.value = []
  if (info.value.series.trim().length > 0) {
    fetchMoviePagedList({
      series: info.value.series,
      page: 1,
      pageSize: 7,
      sort: 'id',
      sortRule: 'RAND'
    }).then(res => {
      if (res.data) {
        seriesMovies.value = res.data.records.filter(x => x.num !== info.value.num)
      }
    })
  }
}

const recommendedTag = ref('')
const recommendedTagMovies = ref<Array<Dto.DbMovie>>([])
function getRecommendedTagMovies() {
  fetchMoviePagedList({
    tags: [recommendedTag.value],
    page: 1,
    pageSize: 7,
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
const targetElement = ref<HTMLElement | null>(null)

function loadMovieInfo() {
  // 自动返回顶部
  nextTick(() => {
    if (targetElement.value) {
      targetElement.value.scrollIntoView({ behavior: 'smooth' })
    }
  })
  findMovie(route.query.num as string).then((res) => {
    if (res.data != null) {
      info.value = res.data
      fetchActressPagedList({
        page: 1,
        pageSize: 30,
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
  width: 98vw;
  border: 0px;
  background: rgba(0, 0, 0, 0.6);
  /* 半透明背景 */
  backdrop-filter: blur(60px);
  /* 模糊背景 */
  -webkit-backdrop-filter: blur(30px);
  /* 兼容Safari */
}
</style>

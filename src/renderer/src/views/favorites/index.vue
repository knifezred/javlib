<template>
  <NFlex>
    <n-tabs default-value="movie" justify-content="space-evenly" type="card" animated>
      <n-tab-pane name="movie" :tab="$t('page.favorites.movie') + '（' + favCount.movie + '）'">
        <NSpace class="ma-4">
          <NCard
            v-for="movie in favoritesData.movie"
            :key="movie.file"
            :bordered="false"
            size="small"
            class="relative z-4 w-48 h-86 rd-12px text-center"
            :title="movie.title"
            hoverable
            @click="showMovieInfo(movie)">
            <template #cover>
              <img :src="movie.cover" />
            </template>
            <template #header-extra>
              <n-p depth="3" class="ma-0">{{ movie.year }}</n-p>
            </template>
          </NCard>
        </NSpace>
      </n-tab-pane>
      <n-tab-pane
        name="actress"
        :tab="$t('route.category_actress') + '（' + favCount.actress + '）'">
        <NSpace> </NSpace>
      </n-tab-pane>
      <n-tab-pane name="studio" :tab="$t('route.category_studio') + '（' + favCount.studio + '）'">
        <NSpace> </NSpace>
      </n-tab-pane>
      <n-tab-pane name="series" :tab="$t('route.category_series') + '（' + favCount.series + '）'">
        <NSpace> </NSpace>
      </n-tab-pane>
    </n-tabs>
    <n-drawer v-model:show="active" width="70%" placement="right">
      <n-drawer-content title="Video Detail">
        <VideoPage :info="currentMovieInfo"></VideoPage>
      </n-drawer-content>
    </n-drawer>
  </NFlex>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import VideoPage from '../library/modules/video-page.vue'

defineOptions({
  name: 'Favorites'
})

const active = ref(false)
const currentMovieInfo = ref<Dto.DbMovie>({
  title: '',
  originTitle: '',
  introduction: '',
  file: '',
  torrent: '',
  cover: '',
  poster: '',
  tags: '',
  studio: '',
  series: '',
  actress: '',
  director: '',
  year: 0,
  releaseTime: '',
  score: 0,
  uniqueid: '',
  num: '',
  genres: '',
  country: '',
  fileSize: 0,
  createdTime: 0,
  viewCount: 0,
  favorite: false,
  personalScore: undefined
})
function showMovieInfo(movie: any) {
  currentMovieInfo.value = movie
  active.value = true
}

const favCount = ref({
  movie: 1,
  actress: 0,
  studio: 0,
  series: 0
})
const favoritesData = ref({
  movie: [] as Array<Dto.DbMovie>,
  actress: [],
  studio: [],
  series: []
})
onMounted(() => {})
</script>

<style scoped></style>

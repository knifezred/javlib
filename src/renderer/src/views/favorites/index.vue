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
      <n-tab-pane name="actor" :tab="$t('route.category_actor') + '（' + favCount.actor + '）'">
        <NSpace> </NSpace>
      </n-tab-pane>
      <n-tab-pane name="brand" :tab="$t('route.category_brand') + '（' + favCount.brand + '）'">
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
const currentMovieInfo = ref<Dto.MovieInfo>({
  title: '',
  originTitle: '',
  introduction: '',
  file: '',
  torrent: '',
  cover: '',
  poster: '',
  tags: [],
  brand: '',
  series: '',
  actor: '',
  actors: [],
  director: '',
  year: 0,
  releaseTime: '',
  addTime: '',
  viewCount: 0,
  favorite: false,
  score: 0,
  personalScore: undefined
})
function showMovieInfo(movie: any) {
  currentMovieInfo.value = movie
  active.value = true
}

const favCount = ref({
  movie: 1,
  actor: 0,
  brand: 0,
  series: 0
})
const favoritesData = ref({
  movie: [] as Array<Dto.MovieInfo>,
  actor: [],
  brand: [],
  series: []
})
function favoritesMovie() {
  favoritesData.value.movie = [
    {
      title: '楚门的世界',
      originTitle: 'The Shawshank Redemption',
      introduction: 'test',
      file: 'D:\\BaiduNetdiskDownload\\The Truman Show.mp4',
      torrent: '',
      cover: 'D:/BaiduNetdiskDownload/folder.jpg',
      poster: 'D:/BaiduNetdiskDownload/folder.jpg',
      tags: [],
      brand: '',
      series: '',
      actor: '',
      actors: [],
      director: '',
      year: 1998,
      releaseTime: '',
      addTime: '',
      viewCount: 0,
      favorite: true,
      score: 10,
      personalScore: 0
    }
  ]
}
onMounted(() => {
  favoritesMovie()
})
</script>

<style scoped></style>

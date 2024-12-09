<template>
  <NFlex>
    <n-tabs default-value="movie" justify-content="space-evenly" type="card" animated>
      <n-tab-pane name="movie" :tab="$t('page.favorites.movie') + '（' + favCount.movie + '）'">
        <NSpace class="ma-4">
          <MovieCard
            v-for="movie in favoritesData.movie"
            :key="movie.file"
            :movie="movie"></MovieCard>
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
  </NFlex>
</template>

<script setup lang="ts">
import { fetchMoviePagedList } from '@renderer/service/api/movie'
import { onMounted, ref } from 'vue'

defineOptions({
  name: 'Favorites'
})

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
onMounted(() => {
  fetchMoviePagedList({
    page: 1,
    pageSize: 20,
    sort: 'updatedTime',
    sortRule: 'DESC',
    favorite: true
  }).then((res) => {
    if (res.data != null) {
      favoritesData.value.movie = res.data.records
      favCount.value.movie = res.data.total
    } else {
      favoritesData.value.movie = []
      favCount.value.movie = 0
    }
  })
})
</script>

<style scoped></style>

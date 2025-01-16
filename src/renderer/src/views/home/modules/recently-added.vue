<template>
  <NCard title="最近入库">
    <n-carousel
      class="z-3"
      slides-per-view="auto"
      :space-between="10"
      :show-dots="false"
      show-arrow
      draggable>
      <n-carousel-item
        v-for="movie in movies"
        :key="movie.num"
        style="width: 12rem;">
        <MovieCard
          :movie="movie"
          sort="score"></MovieCard>
      </n-carousel-item>
    </n-carousel>
  </NCard>
</template>

<script setup lang="ts">
import { fetchMoviePagedList } from '@renderer/service/api/movie'
import { onMounted, ref } from 'vue'


const movies = ref<Array<Dto.DbMovie>>([])
function initMovies() {
  movies.value = []
  fetchMoviePagedList({
    page: 1,
    pageSize: 20,
    viewCount: -1,
    sort: 'createdTime',
    sortRule: 'DESC'
  }).then((res) => {
    if (res.data) {
      movies.value = res.data.records
    }
  })
}
onMounted(() => {
  initMovies()
})
</script>

<style scoped></style>
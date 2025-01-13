<template>
  <NCard>
    <n-h3 depth="3" class="mb-2 mt-xl text-light-9"> 最近添加 </n-h3>
    <NSpace>
      <MovieCard
        v-for="movie in movies"
        :key="movie.id"
        :movie="movie"
        sort="score"></MovieCard>
    </NSpace>
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
    pageSize: 7,
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
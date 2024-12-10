<template>
  <NFlex vertical>
    <n-collapse :default-expanded-names="['1']">
      <n-collapse-item :title="$t('route.category_series')" name="1">
        <NSpace>
          <NCard
            v-for="series in seriesList"
            :key="series.series"
            :bordered="false"
            class="relative z-4 w-auto rd-12px cursor-pointer text-center text-center transition-transform duration-300 hover:transform-translate-y--2"
            @click="showMovieList(series)">
            {{ series.series }}
          </NCard>
        </NSpace>
      </n-collapse-item>
    </n-collapse>
    <NSpace v-if="isShowMovie" vertical>
      <NSpace>
        <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie"></MovieCard>
      </NSpace>
      <n-pagination
        v-model:page="searchData.page"
        v-model:page-size="searchData.pageSize"
        :page-count="pageCount"
        show-size-picker
        :page-sizes="pageSizeOptions"
        @update-page="handleSearch"
        @update-page-size="handleSearch" />
    </NSpace>
  </NFlex>
</template>

<script setup lang="ts">
import { pageSizeOptions } from '@renderer/constants/library'
import { fetchMoviePagedList, findAllSeries } from '@renderer/service/api/movie'
import { onMounted, ref } from 'vue'

defineOptions({
  name: 'Series'
})
const seriesList = ref<Array<Dto.DbMovie>>([])
const movies = ref<Array<Dto.DbMovie>>([])
const isShowMovie = ref(false)
const searchData = ref<Dto.MovieSearchOption>({
  sort: 'title',
  sortRule: 'ASC',
  page: 1,
  pageSize: 20
})
const pageCount = ref(1)
function showMovieList(movie: Dto.DbMovie) {
  isShowMovie.value = true
  searchData.value.series = movie.series
  handleSearch()
}
function handleSearch() {
  fetchMoviePagedList(searchData.value).then((res) => {
    if (res.data) {
      movies.value = res.data.records
      pageCount.value = Math.ceil(res.data.total / searchData.value.pageSize)
    } else {
      movies.value = []
      pageCount.value = 1
    }
  })
}
onMounted(() => {
  findAllSeries().then((res) => {
    if (res.data) {
      seriesList.value = res.data
    } else {
      seriesList.value = []
    }
  })
})
</script>

<style scoped></style>

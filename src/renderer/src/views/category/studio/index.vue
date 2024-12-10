<template>
  <NFlex vertical>
    <n-collapse :default-expanded-names="['1']">
      <n-collapse-item :title="$t('route.category_studio')" name="1">
        <NSpace>
          <NCard
            v-for="studio in studioList"
            :key="studio.studio"
            :bordered="false"
            class="relative z-4 w-auto rd-12px cursor-pointer text-center text-center transition-transform duration-300 hover:transform-translate-y--2"
            @click="showMovieList(studio)">
            {{ studio.studio }}
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
import { fetchMoviePagedList, findAllStudio } from '@renderer/service/api/movie'
import { onMounted, ref } from 'vue'

defineOptions({
  name: 'Studio'
})
const studioList = ref<Array<Dto.DbMovie>>([])
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
  searchData.value.studio = movie.studio
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
  findAllStudio().then((res) => {
    if (res.data) {
      studioList.value = res.data
    } else {
      studioList.value = []
    }
  })
})
</script>

<style scoped></style>

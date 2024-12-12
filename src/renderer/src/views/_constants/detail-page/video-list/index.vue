<template>
  <NFlex vertical>
    <n-page-header @back="routerBack">
      <NSpace>
        <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie"></MovieCard>
      </NSpace>
      <template #title> {{ pageTitle }}（{{ totalCount }}） </template>
      <template #footer>
        <n-pagination
          v-model:page="searchData.page"
          v-model:page-size="searchData.pageSize"
          :page-count="pageCount"
          show-size-picker
          :page-sizes="pageSizeOptions"
          @update-page="handleSearch"
          @update-page-size="handleSearch" />
      </template>
    </n-page-header>
  </NFlex>
</template>

<script setup lang="ts">
import { pageSizeOptions } from '@renderer/constants/library'
import { useRouterPush } from '@renderer/hooks/common/router'
import { fetchMoviePagedList } from '@renderer/service/api/movie'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'MovieListPage'
})
const route = useRoute()
const { routerBack } = useRouterPush()
const pageTitle = ref('')
const movies = ref<Array<Dto.DbMovie>>([])
const searchData = ref<Dto.MovieSearchOption>({
  sort: 'title',
  sortRule: 'ASC',
  page: 1,
  pageSize: 20
})
const pageCount = ref(1)
const totalCount = ref(0)
function handleSearch() {
  if (route.query.studio) {
    searchData.value.studio = route.query.studio as string
    pageTitle.value = searchData.value.studio
  }
  if (route.query.series) {
    searchData.value.series = route.query.series as string
    pageTitle.value = searchData.value.series
  }
  if (route.query.type && route.query.key) {
    if (route.query.type == 'tag') {
      searchData.value.tags = [route.query.key as string]
      pageTitle.value = searchData.value.tags[0]
    }
  }
  if (route.query.actress) {
    searchData.value.actress = route.query.actress as string
    pageTitle.value = searchData.value.actress
  }
  fetchMoviePagedList(searchData.value).then((res) => {
    if (res.data) {
      movies.value = res.data.records
      pageCount.value = Math.ceil(res.data.total / searchData.value.pageSize)
      totalCount.value = res.data.total
    } else {
      movies.value = []
      pageCount.value = 1
      totalCount.value = 0
    }
  })
}
onMounted(() => {
  handleSearch()
})
</script>

<style scoped></style>

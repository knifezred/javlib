<template>
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
</template>

<script setup lang="ts">
import { useRouterPush } from '@renderer/hooks/common/router'
import { findAllSeries } from '@renderer/service/api/movie'
import { onMounted, ref } from 'vue'

defineOptions({
  name: 'Series'
})
const { routerPushByKey } = useRouterPush()
const seriesList = ref<Array<Dto.DbMovie>>([])
function showMovieList(movie: Dto.DbMovie) {
  routerPushByKey('detail-page_video-list', {
    query: {
      series: movie.series
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

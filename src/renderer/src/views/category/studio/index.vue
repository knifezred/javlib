<template>
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
</template>

<script setup lang="ts">
import { useRouterPush } from '@renderer/hooks/common/router'
import { findAllStudio } from '@renderer/service/api/movie'
import { onMounted, ref } from 'vue'

defineOptions({
  name: 'Studio'
})
const { routerPushByKey } = useRouterPush()
const studioList = ref<Array<Dto.DbMovie>>([])
function showMovieList(movie: Dto.DbMovie) {
  routerPushByKey('detail-page_video-list', {
    query: {
      studio: movie.studio
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

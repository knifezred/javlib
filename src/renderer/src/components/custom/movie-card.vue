<template>
  <NCard
    :bordered="false"
    size="small"
    class="relative z-4 w-48 rd-12px text-center"
    hoverable
    @click="showMovieInfo(movie)">
    <template #cover>
      <img
        :src="movie.poster"
        class="w-48 h-72 transition-transform duration-300 hover:transform-scale-120" />
    </template>
    <n-p class="ma-0 line-clamp-2">{{ movie.title }}</n-p>
    <n-p depth="3" class="ma-0">{{ movie.year }} ({{ movie.score }})</n-p>
  </NCard>
</template>
<script lang="ts" setup>
import { useRouterPush } from '@renderer/hooks/common/router'

defineOptions({
  name: 'MovieCard'
})
interface Props {
  /** Button class */
  movie: Dto.DbMovie
}
defineProps<Props>()

const routerPush = useRouterPush()
function showMovieInfo(entity: Dto.DbMovie) {
  routerPush.routerPushByKey('detail-page_video', { query: { num: entity.num } })
}
</script>

<template>
  <NCard
    :bordered="false"
    size="small"
    class="relative z-4 w-40 rd-12px text-center"
    hoverable
    @click="showMovieInfo(movie)">
    <template #cover>
      <img :src="movie.poster" class="w-40 h-60 hover:transform-scale-120 blur-lg" />
    </template>
    <n-p class="ma-0 line-clamp-2">{{ movie.title }}</n-p>
    <n-p depth="3" class="ma-0">{{ movie.year }} ({{ movie.score }})</n-p>
  </NCard>
</template>
<script lang="ts" setup>
defineOptions({
  name: 'MovieCard'
})
interface Props {
  /** Button class */
  movie: Dto.MovieInfo
}
defineProps<Props>()

interface Emits {
  (e: 'show-detail', movie: Dto.MovieInfo): Dto.MovieInfo
}

const emit = defineEmits<Emits>()

function showMovieInfo(movie: Dto.MovieInfo) {
  emit('show-detail', movie)
}
</script>

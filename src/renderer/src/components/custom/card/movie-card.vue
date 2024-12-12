<template>
  <NCard :bordered="false" size="small" class="relative z-4 w-48 rd-12px text-center" hoverable>
    <template #cover>
      <img
        :src="movie.poster"
        class="w-48 h-72 cursor-pointer transition-transform duration-300 hover:transform-scale-120"
        @click="showMovieInfo(movie)" />
    </template>
    <n-p class="ma-0 pt-1 line-clamp-2 cursor-pointer" @click="showMovieInfo(movie)">{{
      movie.title
    }}</n-p>
    <n-p depth="3" class="ma-0">
      {{ movie.year }} ({{ movie.score }})
      <n-button text class="font-size-5" @click="setFavorite">
        <n-icon>
          <SvgIcon
            class="inline-flex"
            :icon="
              favorite ? 'fluent-emoji-flat:heart-suit' : 'fluent-emoji-flat:grey-heart'
            "></SvgIcon>
        </n-icon>
      </n-button>
    </n-p>
  </NCard>
</template>
<script lang="ts" setup>
import { useRouterPush } from '@renderer/hooks/common/router'
import { $t } from '@renderer/locales'
import { updateMovie } from '@renderer/service/api/movie'
import { onMounted, ref } from 'vue'

defineOptions({
  name: 'MovieCard'
})
interface Props {
  /** Button class */
  movie: Dto.DbMovie
}
const props = defineProps<Props>()
const favorite = ref(false)
function setFavorite() {
  const temp = props.movie
  favorite.value = !favorite.value
  temp.favorite = favorite.value
  updateMovie(temp).then((res) => {
    if (res.data) {
      window.$message?.success(
        temp.favorite ? $t('common.addFavorite') : $t('common.removeFavorite')
      )
    }
  })
}
const routerPush = useRouterPush()
function showMovieInfo(entity: Dto.DbMovie) {
  routerPush.routerPushByKey('detail-page_video', { query: { num: entity.num } })
}
onMounted(() => {
  favorite.value = props.movie.favorite
})
</script>

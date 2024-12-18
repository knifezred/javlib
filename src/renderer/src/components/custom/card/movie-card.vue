<template>
  <NCard :bordered="false" size="small" class="relative z-4 w-48 rd-12px text-center" hoverable>
    <template #cover>
      <img
        :src="movie.poster"
        class="w-48 h-72 cursor-pointer transition-transform duration-300 hover:transform-scale-120"
        @click="showMovieInfo(movie)" />
    </template>
    <n-button
      text
      class="font-size-5 pointer-events-auto absolute-tr pr-4 pt-64 z-10"
      @click="setFavorite">
      <n-icon>
        <SvgIcon
          class="inline-flex"
          :icon="
            favorite ? 'fluent-emoji-flat:heart-suit' : 'fluent-emoji-flat:grey-heart'
          "></SvgIcon>
      </n-icon>
    </n-button>
    <n-p class="ma-0 pt-1 line-clamp-2 cursor-pointer" @click="showMovieInfo(movie)">
      {{ movie.title }}
    </n-p>
    <n-p v-if="sort != 'personalScore'" depth="3" class="ma-0">
      {{ sortText }}
    </n-p>
    <n-rate
      v-else
      allow-half
      v-model:value="movie.personalScore"
      readonly
      size="small"
      class="mt-1" />
  </NCard>
</template>
<script lang="ts" setup>
import { useRouterPush } from '@renderer/hooks/common/router'
import { $t } from '@renderer/locales'
import { updateMovie } from '@renderer/service/api/movie'
import { onMounted, ref, watch } from 'vue'

defineOptions({
  name: 'MovieCard'
})
interface Props {
  /** Button class */
  movie: Dto.DbMovie
  sort: string
}
const props = defineProps<Props>()
const sortText = ref<string>('')
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
watch(
  () => props.sort,
  () => {
    if (props.sort == 'createdTime') {
      sortText.value = new Date(props.movie.createdTime).toLocaleDateString()
    } else if (props.sort == 'title') {
      sortText.value = props.movie.year.toString()
    } else {
      sortText.value = props.movie[props.sort]
    }
  },
  { immediate: true }
)
onMounted(() => {
  favorite.value = props.movie.favorite
})
</script>

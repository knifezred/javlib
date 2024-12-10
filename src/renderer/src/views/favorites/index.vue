<template>
  <NFlex>
    <n-tabs default-value="movie" justify-content="space-evenly" type="card" animated>
      <n-tab-pane name="movie" :tab="$t('page.favorites.movie') + '（' + favCount.movie + '）'">
        <NSpace class="ma-4">
          <n-empty v-if="favCount.movie == 0" size="large" description="什么也没有">
            <template #icon>
              <n-icon>
                <SvgIcon icon="solar:hand-heart-bold-duotone" />
              </n-icon>
            </template>
          </n-empty>
          <MovieCard
            v-for="movie in favoritesData.movie"
            :key="movie.file"
            :movie="movie"></MovieCard>
        </NSpace>
      </n-tab-pane>
      <n-tab-pane
        name="actress"
        :tab="$t('route.category_actress') + '（' + favCount.actress + '）'">
        <n-empty v-if="favCount.actress == 0" size="large" class="ma-auto" description="什么也没有">
          <template #icon>
            <n-icon>
              <SvgIcon icon="solar:hand-heart-bold-duotone" />
            </n-icon>
          </template>
        </n-empty>
        <NSpace class="ma-4">
          <ActressCard
            v-for="actress in favoritesData.actress"
            :key="actress.name"
            :actress="actress"></ActressCard>
        </NSpace>
      </n-tab-pane>
      <n-tab-pane name="studio" :tab="$t('route.category_studio') + '（' + favCount.studio + '）'">
        <n-empty v-if="favCount.studio == 0" size="large" class="ma-auto" description="什么也没有">
          <template #icon>
            <n-icon>
              <SvgIcon icon="solar:hand-heart-bold-duotone" />
            </n-icon>
          </template>
        </n-empty>
        <NSpace>
          <FavoriteCardGroup
            :keys="favoritesData.studio"
            storage-key="favoriteStudio"
            type="studio" />
        </NSpace>
      </n-tab-pane>
      <n-tab-pane name="series" :tab="$t('route.category_series') + '（' + favCount.series + '）'">
        <n-empty v-if="favCount.series == 0" size="large" class="ma-auto" description="什么也没有">
          <template #icon>
            <n-icon>
              <SvgIcon icon="solar:hand-heart-bold-duotone" />
            </n-icon>
          </template>
        </n-empty>
        <NSpace>
          <FavoriteCardGroup
            :keys="favoritesData.series"
            storage-key="favoriteSeries"
            type="series" />
        </NSpace>
      </n-tab-pane>
    </n-tabs>
  </NFlex>
</template>

<script setup lang="ts">
import ActressCard from '@renderer/components/custom/card/actress-card.vue'
import FavoriteCardGroup from '@renderer/components/custom/card/favorite-card-group.vue'
import MovieCard from '@renderer/components/custom/card/movie-card.vue'
import { fetchActressPagedList } from '@renderer/service/api/actress'
import { fetchMoviePagedList } from '@renderer/service/api/movie'
import { findStorage } from '@renderer/service/api/storage'
import { onMounted, ref } from 'vue'

defineOptions({
  name: 'Favorites'
})

const favCount = ref({
  movie: 0,
  actress: 0,
  studio: 0,
  series: 0
})
const favoritesData = ref({
  movie: [] as Array<Dto.DbMovie>,
  actress: [] as Array<Dto.DbActress>,
  studio: [] as Array<string>,
  series: [] as Array<string>
})
onMounted(() => {
  fetchMoviePagedList({
    page: 1,
    pageSize: 20,
    sort: 'updatedTime',
    sortRule: 'DESC',
    favorite: true
  }).then((res) => {
    if (res.data != null) {
      favoritesData.value.movie = res.data.records
      favCount.value.movie = res.data.total
    } else {
      favoritesData.value.movie = []
      favCount.value.movie = 0
    }
  })

  fetchActressPagedList({
    page: 1,
    pageSize: 20,
    sort: 'updatedTime',
    sortRule: 'DESC',
    favorite: true
  }).then((res) => {
    if (res.data != null) {
      favoritesData.value.actress = res.data.records
      favCount.value.actress = res.data.total
    } else {
      favoritesData.value.actress = []
      favCount.value.actress = 0
    }
  })
  findStorage('favoriteSeries').then((res) => {
    if (res.data) {
      favoritesData.value.series = res.data.value.split('|')
      favCount.value.series = favoritesData.value.series.length
    } else {
      favoritesData.value.series = []
      favCount.value.series = 0
    }
  })
  findStorage('favoriteStudio').then((res) => {
    if (res.data) {
      favoritesData.value.studio = res.data.value.split('|')
      favCount.value.studio = favoritesData.value.studio.length
    } else {
      favoritesData.value.studio = []
      favCount.value.studio = 0
    }
  })
})
</script>

<style scoped></style>

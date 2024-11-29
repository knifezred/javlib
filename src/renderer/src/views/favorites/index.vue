<template>
  <n-tabs default-value="movie" justify-content="space-evenly" type="card" animated>
    <n-tab-pane name="movie" :tab="$t('page.favorites.movie') + '（' + favCount.movie + '）'">
      <NSpace>
        <NCard
          :bordered="false"
          size="small"
          class="relative z-4 w-48 h-86 rd-12px text-center"
          title="楚门的世界"
          hoverable>
          <template #cover>
            <img src="@renderer/assets/imgs/the.truman.show.jpg" />
          </template>
          <template #header-extra> <n-p depth="3" class="ma-0">1998</n-p> </template>
        </NCard>
      </NSpace>
    </n-tab-pane>
    <n-tab-pane name="actor" :tab="$t('route.category_actor') + '（' + favCount.actor + '）'">
      <NSpace>
        <NCard
          :bordered="false"
          size="small"
          class="relative z-4 w-48 h-86 rd-12px text-center"
          title="楚门的世界"
          hoverable>
          <template #cover>
            <img src="@renderer/assets/imgs/the.truman.show.jpg" />
          </template>
          <template #header-extra> <n-p depth="3" class="ma-0">1998</n-p> </template>
        </NCard>
      </NSpace>
    </n-tab-pane>
    <n-tab-pane name="brand" :tab="$t('route.category_brand') + '（' + favCount.brand + '）'">
      <NSpace>
        <NCard
          :bordered="false"
          size="small"
          class="relative z-4 w-48 h-86 rd-12px text-center"
          title="楚门的世界"
          hoverable>
          <template #cover>
            <img src="@renderer/assets/imgs/the.truman.show.jpg" />
          </template>
          <template #header-extra> <n-p depth="3" class="ma-0">1998</n-p> </template>
        </NCard>
      </NSpace>
    </n-tab-pane>
    <n-tab-pane name="series" :tab="$t('route.category_series') + '（' + favCount.series + '）'">
      <NSpace>
        <NCard
          :bordered="false"
          size="small"
          class="relative z-4 w-48 h-86 rd-12px text-center"
          title="楚门的世界"
          hoverable>
          <template #cover>
            <img src="@renderer/assets/imgs/the.truman.show.jpg" />
          </template>
          <template #header-extra> <n-p depth="3" class="ma-0">1998</n-p> </template>
        </NCard>
      </NSpace>
    </n-tab-pane>
  </n-tabs>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  name: 'Favorites'
})
const favCount = ref({
  movie: 1,
  actor: 0,
  brand: 0,
  series: 0
})
</script>

<style scoped></style>

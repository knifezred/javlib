<template>
  <NSpace>
    <FavoriteCardGroup :keys="keys" storage-key="favorite_series" type="series" />
  </NSpace>
</template>

<script setup lang="ts">
import { findAllSeries } from '@renderer/service/api/movie'
import { onMounted, ref } from 'vue'

defineOptions({
  name: 'Series'
})
const keys = ref<Array<string>>([])
onMounted(() => {
  findAllSeries().then((res) => {
    if (res.data) {
      res.data.forEach((item) => {
        if (item.series.length > 0) {
          keys.value.push(item.series)
        }
      })
    } else {
      keys.value = []
    }
  })
})
</script>

<style scoped></style>

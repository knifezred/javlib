<template>
  <NSpace>
    <FavoriteCardGroup :keys="keys" storage-key="favorite_studio" type="studio" />
  </NSpace>
</template>

<script setup lang="ts">
import { findAllStudio } from '@renderer/service/api/movie'
import { onMounted, ref } from 'vue'

defineOptions({
  name: 'Studio'
})
const keys = ref<Array<string>>([])
onMounted(() => {
  findAllStudio().then((res) => {
    if (res.data) {
      res.data.forEach((item) => {
        keys.value.push(item.studio)
      })
    } else {
      keys.value = []
    }
  })
})
</script>

<style scoped></style>

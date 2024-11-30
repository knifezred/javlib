<template>
  <NSpace>
    <NCard :bordered="false" class="relative z-4 w-auto rd-12px text-center">
      <icon-local-logo class="w-32 h-32" />
      <n-divider />
      <NAlert title="Brand page" type="info" :bordered="false"></NAlert>
    </NCard>
  </NSpace>
</template>

<script setup lang="ts">
defineOptions({
  name: 'Brand'
})
</script>

<style scoped></style>

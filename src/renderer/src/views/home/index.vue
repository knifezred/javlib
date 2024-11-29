<template>
  <NSpace>
    <NCard :bordered="false" class="relative z-4 w-auto rd-12px text-center">
      <icon-local-logo class="w-32 h-32" />
      <n-divider />
      <NAlert title="Home page" type="info" :bordered="false"></NAlert>
    </NCard>
    <NCard :bordered="false" class="relative z-4 w-auto rd-12px text-center">
      <icon-local-no-icon class="w-32 h-32" />
      <n-divider />
      <NAlert title="Home page" type="success" :bordered="false"></NAlert>
    </NCard>
    <NCard :bordered="false" class="relative z-4 w-auto rd-12px text-center">
      <icon-local-avatar class="w-32 h-32" />
      <n-divider />
      <NAlert title="Home page" type="warning" :bordered="false"></NAlert>
    </NCard>
  </NSpace>
</template>

<script setup lang="ts">
defineOptions({
  name: 'Home'
})
</script>

<style scoped></style>

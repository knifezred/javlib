<template>
  <NSpace vertical :size="16">
    <CardData />
    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:14">
        <NCard :bordered="false" class="card-wrapper">
          <LineChart />
        </NCard>
      </NGi>
      <NGi span="24 s:24 m:10">
        <NCard :bordered="false" class="card-wrapper">
          <PieChart />
        </NCard>
      </NGi>
    </NGrid>
    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:14">
        <ProjectNews />
      </NGi>
      <NGi span="24 s:24 m:10">
        <CreativityBanner />
      </NGi>
    </NGrid>
  </NSpace>
</template>

<script setup lang="ts">
import { useAppStore } from '@renderer/store/modules/app'
import { computed } from 'vue'
import CardData from './modules/card-data.vue'
import CreativityBanner from './modules/creativity-banner.vue'
import LineChart from './modules/line-chart.vue'
import PieChart from './modules/pie-chart.vue'
import ProjectNews from './modules/project-news.vue'

defineOptions({
  name: 'Home'
})
const appStore = useAppStore()
const gap = computed(() => (appStore.isMobile ? 0 : 16))
</script>

<style scoped></style>

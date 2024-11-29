<script setup lang="ts">
import { $t } from '@renderer/locales'
import { computed } from 'vue'

defineOptions({
  name: 'ProjectNews'
})

interface NewsItem {
  id: number
  content: string
  time: string
}

const newses = computed<NewsItem[]>(() => [
  { id: 2, content: $t('page.home.projectNews.desc2'), time: '2021-10-27 10:24:54' },
  { id: 1, content: $t('page.home.projectNews.desc1'), time: '2024-11-29 10:50:29' }
])
</script>

<template>
  <NCard
    :title="$t('page.home.projectNews.title')"
    :bordered="false"
    size="small"
    segmented
    class="card-wrapper">
    <template #header-extra>
      <a
        class="text-primary"
        target="_blank"
        href="https://github.com/knifezred/javlib/commits/main/"
        >{{ $t('page.home.projectNews.moreNews') }}</a
      >
    </template>
    <NList>
      <NListItem v-for="item in newses" :key="item.id">
        <template #prefix>
          <SoybeanAvatar class="size-48px!" />
        </template>
        <NThing :title="item.content" :description="item.time" />
      </NListItem>
    </NList>
  </NCard>
</template>

<style scoped></style>

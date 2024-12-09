<template>
  <n-grid x-gap="12" y-gap="24" :cols="2">
    <n-gi :span="2">
      <n-page-header :subtitle="info.originTitle" @back="routerBack">
        <NCard>
          <NSpace justify="start">
            <div>
              <img :src="info.cover == '' ? info.poster : info.cover" class="w-150" />
            </div>
            <NFlex vertical class="w-2xl">
              <n-h1> {{ info.title }} ({{ info.year }})</n-h1>
              <NSpace justify="space-between">
                <n-statistic label="上映时间" :value="info.releaseTime" />
                <n-statistic label="媒体评分" :value="info.score" />
                <n-statistic label="导演" :value="info.director" />
                <n-statistic label="厂商" :value="info.studio" />
              </NSpace>
              <n-p>入库时间：{{ new Date(info.createdTime).toLocaleDateString() }}</n-p>
              <n-h4 class="my-0">剧情简介</n-h4>
              <n-p class="line-clamp-6">{{ info.introduction }}</n-p>
            </NFlex>
          </NSpace>
          <n-h2>演员</n-h2>
          <NSpace>
            <n-tag
              v-for="actor in info.actress.substring(1, info.actress.length - 1).split('|')"
              :key="actor"
              class="cursor-pointer"
              @click="goTagPage(actor)">
              {{ actor }}</n-tag
            >
          </NSpace>
        </NCard>
        <template #title>
          {{ info.title }}
        </template>
        <template #header>
          <n-breadcrumb>
            <n-breadcrumb-item
              v-for="tag in info.genres.split('|')"
              :key="tag"
              @click="goTagPage(tag)">
              {{ tag }}
            </n-breadcrumb-item>
          </n-breadcrumb>
        </template>
        <!-- <template #avatar>
        </template> -->
        <template #extra>
          <n-space>
            <n-button disabled>{{ $t('common.modify') }}</n-button>
          </n-space>
        </template>
      </n-page-header>
    </n-gi>
    <n-gi span="2">
      <NCard title="相关推荐"> </NCard>
    </n-gi>
    <n-gi>
      <NCard title="相关推荐"> </NCard>
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { useRouterPush } from '@renderer/hooks/common/router'
import { findMovie } from '@renderer/service/api/movie'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'VideoDetail'
})

const route = useRoute()
const { routerBack } = useRouterPush()

const info = ref<Dto.DbMovie>({
  createdTime: 0,
  viewCount: 0,
  favorite: false,
  personalScore: undefined,
  uniqueid: '',
  num: '',
  title: '',
  originTitle: '',
  introduction: '',
  file: '',
  torrent: '',
  cover: '',
  poster: '',
  tags: '',
  genres: '',
  studio: '',
  country: '',
  series: '',
  actress: '',
  director: '',
  year: 0,
  releaseTime: '',
  score: 0,
  fileSize: 0
})
onMounted(() => {
  findMovie(route.query.num as string).then((res) => {
    if (res.data != null) {
      info.value = res.data
    }
  })
})

function goTagPage(tag: string) {
  window.$message?.info(tag)
}
</script>

<style scoped></style>

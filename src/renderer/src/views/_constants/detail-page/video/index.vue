<template>
  <n-grid x-gap="12" y-gap="24" :cols="2">
    <n-gi :span="2">
      <n-page-header :subtitle="info.originTitle" @back="routerBack">
        <NCard>
          <n-grid :cols="2">
            <n-gi>
              <img :src="info.cover == '' ? info.poster : info.cover" class="h-sm ma-auto" />
            </n-gi>
            <n-gi>
              <NFlex vertical>
                <NSpace justify="space-between">
                  <n-statistic label="上映时间" :value="info.releaseTime" />
                  <n-statistic label="媒体评分" :value="info.score" />
                  <n-statistic
                    label="入库时间"
                    :value="new Date(info.createdTime).toLocaleDateString()" />
                </NSpace>
                <n-p>导演：{{ info.director }}</n-p>
                <n-p><NButton>播放</NButton></n-p>
                <n-p>{{ info.introduction }}</n-p>
              </NFlex>
            </n-gi>
            <n-gi :span="2">
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
            </n-gi>
          </n-grid>
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
            <n-button>催更</n-button>
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
function savePersonalScore(value: number | undefined) {
  window.$message?.info(value + '')
  // props.info.personalScore = value
}
</script>

<style scoped></style>

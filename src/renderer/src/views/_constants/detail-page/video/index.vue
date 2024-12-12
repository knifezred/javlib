<template>
  <n-grid x-gap="12" y-gap="24" :cols="2">
    <n-gi :span="2">
      <n-page-header :subtitle="info.originTitle" @back="routerBack">
        <NCard>
          <NSpace justify="start">
            <div>
              <img :src="info.cover == '' ? info.poster : info.cover" class="w-xl" />
            </div>
            <NFlex vertical class="w-4xl">
              <n-h1 class="my-1">
                {{ info.title }} ({{ info.year }})
                <n-button text class="font-size-2xl" @click="setFavorite">
                  <n-icon>
                    <SvgIcon
                      :icon="
                        info.favorite
                          ? 'fluent-emoji-flat:heart-suit'
                          : 'fluent-emoji-flat:grey-heart'
                      ">
                    </SvgIcon>
                  </n-icon>
                </n-button>
              </n-h1>
              <n-p depth="3" class="my-0">{{ info.originTitle }}</n-p>
              <NSpace justify="space-between">
                <n-statistic label="上映时间" :value="info.releaseTime" />
                <n-statistic label="媒体评分" :value="info.score" />
                <n-statistic label="导演" :value="info.director" />
                <n-statistic label="厂商" :value="info.studio" />
              </NSpace>
              <CategoryCardGroup type="tag" :keys="info.tags"></CategoryCardGroup>
              <n-p>
                <n-button type="primary" @click="playVideo">播放</n-button>
              </n-p>
              <!-- <n-h4 class="my-0">剧情简介</n-h4> -->
              <n-p class="line-clamp-5 mt-0">{{
                info.introduction.replace('<![CDATA[', '').replace(']]>', '')
              }}</n-p>
            </NFlex>
          </NSpace>
          <!-- <n-p>入库时间：{{ new Date(info.createdTime).toLocaleDateString() }}</n-p> -->
          <n-h2>演员</n-h2>
          <NSpace>
            <ActressCard
              v-for="actor in actressList"
              :key="actor.name"
              :actress="actor"
              @click="goTagPage(actor.name)">
            </ActressCard>
          </NSpace>
        </NCard>
        <template #title>
          {{ info.title }}
        </template>
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
import CategoryCardGroup from '@renderer/components/custom/card/category-card-group.vue'
import { useRouterPush } from '@renderer/hooks/common/router'
import { $t } from '@renderer/locales'
import { fetchActressPagedList } from '@renderer/service/api/actress'
import { findMovie, updateMovie } from '@renderer/service/api/movie'
import { findStorage } from '@renderer/service/api/storage'
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
function playVideo() {
  findStorage('ext_player').then((res) => {
    if (res.data) {
      window.electron.ipcRenderer.invoke('play-video', res.data.value, info.value.file)
      info.value.viewCount++
      // 更新播放次数
      updateMovie(info.value)
    }
  })
}
function setFavorite() {
  info.value.favorite = !info.value.favorite
  updateMovie(info.value).then((res) => {
    if (res.data) {
      window.$message?.success(
        info.value.favorite ? $t('common.addFavorite') : $t('common.removeFavorite')
      )
    }
  })
}
const actressList = ref<Array<Dto.DbActress>>([])
onMounted(() => {
  findMovie(route.query.num as string).then((res) => {
    if (res.data != null) {
      info.value = res.data
      fetchActressPagedList({
        page: 1,
        pageSize: 100,
        name: res.data.actress,
        sort: 'updatedTime',
        sortRule: 'DESC'
      }).then((act) => {
        if (act.data != null) {
          var actressArray = info.value.actress.split('|').filter((x) => x.length > 0)
          for (const element of actressArray) {
            var temp = act.data.records.find((x) => x.name == element)
            if (temp) {
              actressList.value.push(temp)
            }
          }
        }
      })
    }
  })
})

function goTagPage(tag: string) {
  window.$message?.info(tag)
}
</script>

<style scoped></style>

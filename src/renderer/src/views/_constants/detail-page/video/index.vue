<template>
  <NSpace
    class="bg-overlay pa-0"
    :style="
      'background: url(file:///' +
      info.cover.replaceAll('\\', '/') +
      ');background-repeat: no-repeat;background-size: cover;backdrop-filter: blur(10px);'
    ">
    <NCard :bordered="false" class="rd-md z-3 frosted-glass-container ma-0">
      <NFlex vertical>
        <n-h1 class="my-0 text-custom">
          <n-button text class="font-size-2xl z-3 color-white" @click="routerBack">
            <n-icon>
              <SvgIcon icon="solar:undo-left-bold-duotone"> </SvgIcon>
            </n-icon>
          </n-button>
          {{ info.title }} ({{ info.year }})
          <n-button text class="font-size-2xl z-3" @click="setFavorite">
            <n-icon>
              <SvgIcon
                :icon="
                  info.favorite ? 'fluent-emoji-flat:heart-suit' : 'fluent-emoji-flat:grey-heart'
                ">
              </SvgIcon>
            </n-icon>
          </n-button>

          <n-button class="z-3 right-0 float-end" type="primary" secondary>
            {{ $t('common.modify') }}
          </n-button>
        </n-h1>
      </NFlex>

      <n-grid class="flex w-sm z-3" x-gap="12" y-gap="0" :cols="4">
        <n-gi>
          <NCard
            :bordered="false"
            class="ma-auto mt-sm w-72 h-120 rd-md text-center flex"
            content-style="padding: 0;"
            hoverable
            @click="playVideo">
            <template #cover>
              <img
                :src="info.poster"
                class="cursor-pointer transition-transform duration-300 hover:transform-scale-120" />
            </template>
            <n-p
              class="frosted-glass-container ma-auto p-1 block cursor-pointer color-primary-400 hover:color-primary-600">
              <SvgIcon class="size-10 inline-block" icon="solar:play-circle-bold-duotone" />
              立即观看
            </n-p>
          </NCard>
        </n-gi>
        <n-gi :span="3">
          <n-p depth="3" class="my-0 text-lg">{{ info.originTitle }} </n-p>
          <n-p class="my-1 text-custom">
            <n-text class="z-3 w-18 inline-block text-custom text-right">评分: &nbsp;</n-text>
            {{ info.score }}
          </n-p>
          <n-p class="my-1 text-custom">
            <n-text class="z-3 w-18 inline-block text-custom text-right">上映时间: &nbsp;</n-text>
            {{ info.releaseTime }}
            <!-- <n-rate
              allow-half
              v-model:value="info.score"
              class="ml-4"
              size="small"
              readonly
              :count="10" /> -->
          </n-p>
          <n-p class="my-1 text-custom">
            {{ info.studio ? '厂商: ' + info.studio : ' ' }}
            {{ info.director ? '  导演: ' + info.director : ' ' }}
          </n-p>
          <CategoryCardGroup
            class="ma-sm text-light-200"
            type="tag"
            :keys="info.tags"></CategoryCardGroup>
          <n-p depth="3" class="my-0 text-lg text-light-9"> 剧情简介 </n-p>
          <n-p class="line-clamp-4 mt-0 text-custom text-lg indent-lg">
            {{ info.introduction.replace('<![CDATA[', '').replace(']]>', '') }}
          </n-p>
          <n-p depth="3" class="my-2 text-lg z-3 text-light-9"> 演员列表 </n-p>
          <n-carousel
            class="z-3"
            slides-per-view="auto"
            :space-between="10"
            :show-dots="false"
            draggable>
            <n-carousel-item
              v-for="actor in actressList"
              :key="actor.name"
              class="w-36"
              style="width: 144px">
              <ActressCard
                :show-second-title="false"
                :actress="actor"
                class="mt-2"
                @click="goTagPage(actor.name)">
              </ActressCard>
            </n-carousel-item>
          </n-carousel>
        </n-gi>
      </n-grid>
    </NCard>
    <NCard class="frosted-glass-container" title="相关推荐"> </NCard>
  </NSpace>
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

<style scoped>
.text-custom {
  color: #fceaba;
  z-index: 3;
}

.frosted-glass-container {
  position: relative;
  width: 100%; /* 根据需要调整 */
  border: 0px;
  background: rgba(0, 0, 0, 0.02); /* 半透明背景 */
  backdrop-filter: blur(12px); /* 模糊背景 */
  -webkit-backdrop-filter: blur(12px); /* 兼容Safari */
}

.bg-overlay {
  position: relative;
}

.bg-overlay::before {
  content: '';
  position: absolute;
  border-radius: 6px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(18, 18, 18, 0.8);
  z-index: 1;
}
</style>

<template>
  <n-grid x-gap="12" y-gap="24" :cols="2">
    <n-gi :span="2">
      <n-page-header @back="routerBack">
        <NCard>
          <NSpace justify="center">
            <div>
              <img :src="info.cover" class="w-80" />
            </div>
            <NFlex vertical class="w-2xl">
              <n-h1 class="mb-0">
                {{ info.name }}
              </n-h1>
              <n-p depth="3" class="my-1">{{ info.alias }}</n-p>
              <NSpace justify="space-between">
                <n-statistic label="出生日期" :value="info.birthday" />
                <n-statistic label="评分" :value="info.score" />
              </NSpace>
              <n-p>入库时间：{{ new Date(info.createdTime).toLocaleDateString() }}</n-p>
              <n-h4 class="my-0">简介</n-h4>
              <n-p class="line-clamp-6">{{ info.introduction }}</n-p>
            </NFlex>
          </NSpace>
        </NCard>
        <template #title>
          {{ $t('common.backToList') }}
        </template>
        <!-- <template #avatar>
        </template> -->
        <template #extra>
          <n-space>
            <n-button @click="openDrawer">{{ $t('common.modify') }}</n-button>
          </n-space>
        </template>
      </n-page-header>
      <n-drawer v-model:show="active" width="70%" placement="right">
        <n-drawer-content>
          <DetailDrawer :info="info" @close="closeDrawer"></DetailDrawer>
        </n-drawer-content>
      </n-drawer>
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
import { findActress } from '@renderer/service/api/actress'
import DetailDrawer from '@renderer/views/category/actress/module/detail-drawer.vue'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'ActressDetail'
})

const route = useRoute()
const { routerBack } = useRouterPush()

const info = ref<Dto.DbActress>({
  createdTime: 0,
  favorite: false,
  score: 0,
  personalScore: 0,
  uniqueid: '',
  name: '',
  alias: '',
  introduction: '',
  avatar: '',
  cover: '',
  tags: '',
  birthday: 0,
  hasVideo: false,
  bust: 0,
  waist: 0,
  hip: 0
})
onMounted(() => {
  findActress(route.query.name as string).then((res) => {
    if (res.data != null) {
      info.value = res.data
    }
  })
})

const active = ref(false)
function openDrawer() {
  active.value = true
}
function closeDrawer() {
  active.value = false
}
</script>

<style scoped></style>

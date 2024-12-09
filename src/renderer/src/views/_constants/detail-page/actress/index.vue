<template>
  <n-grid x-gap="12" y-gap="24" :cols="2">
    <n-gi :span="2">
      <n-page-header @back="routerBack">
        <NCard>
          <NSpace justify="start">
            <div>
              <img :src="info.avatar" class="w-64 rd-md" />
            </div>
            <NFlex vertical class="w-2xl">
              <n-h1 class="mb-0"> {{ info.name }}</n-h1>
              <n-p depth="3" class="my-1">{{ info.alias }}</n-p>
              <n-grid :cols="4">
                <n-gi>
                  <n-statistic label="出生日期" :value="info.birthday" />
                </n-gi>
                <n-gi>
                  <n-statistic
                    label="出道时间"
                    :value="new Date(info.debutDate).toLocaleDateString()" />
                </n-gi>
                <n-gi> <n-statistic label="参演作品" :value="totalMovies" /></n-gi>
                <n-gi> <n-statistic label="身高" :value="info.bodyHeight + 'cm'" /></n-gi>
                <n-gi>
                  <n-statistic
                    label="三围"
                    :value="info.bust + '/' + info.waist + '/' + info.hip" />
                </n-gi>
                <n-gi>
                  <n-statistic
                    label="体型"
                    :value="
                      info.bodySize +
                      '/' +
                      cupOptions.find((x) => x.value == info.cup)?.label +
                      '罩杯'
                    " />
                </n-gi>

                <n-gi>
                  <n-statistic label="综合评分" :value="info.score" />
                </n-gi>
                <n-gi>
                  <n-statistic label="个人评分" :value="info.personalScore" />
                </n-gi>
              </n-grid>
              <n-p class="line-clamp-6">{{ info.introduction }}</n-p>
              <n-p>
                <n-tag v-for="tag in info.tags.split('|').filter((x) => x.length > 0)" :key="tag">
                  {{ tag }}
                </n-tag>
              </n-p>
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
    </n-gi>
    <n-gi :span="2">
      <NCard title="参演作品">
        <NSpace>
          <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie"></MovieCard>
        </NSpace>
      </NCard>
    </n-gi>
    <n-gi>
      <n-drawer v-model:show="active" width="70%" placement="right">
        <n-drawer-content>
          <DetailDrawer :info="info" @close="closeDrawer"></DetailDrawer>
        </n-drawer-content>
      </n-drawer>
    </n-gi>
  </n-grid>
</template>
<script setup lang="ts">
import { cupOptions } from '@renderer/constants/library'
import { useRouterPush } from '@renderer/hooks/common/router'
import { findActress } from '@renderer/service/api/actress'
import { fetchMoviePagedList } from '@renderer/service/api/movie'
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
  category: '',
  name: '',
  alias: '',
  introduction: '',
  avatar: '',
  cover: '',
  tags: '',
  birthday: '',
  hasVideo: false,
  bust: 0,
  waist: 0,
  hip: 0,
  face: 0,
  body: 0,
  cup: 0,
  bodySize: '',
  bodyHeight: 0,
  debutDate: 0
})

const movies = ref<Array<Dto.DbMovie>>([])
const totalMovies = ref(0)
onMounted(() => {
  findActress(route.query.name as string).then((res) => {
    if (res.data != null) {
      info.value = res.data
      // 查找作品
      fetchMoviePagedList({
        sort: 'updatedTime',
        sortRule: 'DESC',
        actress: info.value.name,
        page: 1,
        pageSize: 20
      }).then((res) => {
        if (res.data != null) {
          movies.value = res.data.records
          totalMovies.value = res.data.total
        }
      })
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

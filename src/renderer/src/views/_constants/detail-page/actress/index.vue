<template>
  <n-grid x-gap="12" y-gap="24" :cols="2">
    <n-gi :span="2">
      <n-page-header :title="$t('common.backToList')" @back="routerBack">
        <NCard>
          <NSpace justify="start">
            <div>
              <img
                :src="info.avatar"
                class="w-64 rd-md mx-lg transition-transform duration-300 hover:transform-scale-105 cursor-pointer"
                @click="setAvatar" />
            </div>
            <NFlex vertical class="w-2xl">
              <n-h1 class="mb-0">
                {{ info.name }}
                <n-text :depth="3">({{ age }}岁)</n-text>
              </n-h1>
              <n-p depth="3" class="my-1">{{ info.alias }}</n-p>
              <n-grid :cols="3">
                <n-gi>
                  <n-statistic label="出生日期" :value="info.birthday" />
                </n-gi>
                <n-gi>
                  <n-statistic label="出道时间" :value="info.debutDate" />
                </n-gi>
                <n-gi> <n-statistic label="参演作品" :value="totalMovies" /></n-gi>
                <n-gi>
                  <n-statistic
                    label="体型"
                    :value="
                      info.bodySize +
                      (info.cup > 0 ? '/' + cupOptions.find((x) => x.value == info.cup)?.label : '')
                    " />
                </n-gi>
                <n-gi> <n-statistic label="身高" :value="info.bodyHeight + 'cm'" /></n-gi>
                <!-- <n-gi>
                  <n-statistic
                    label="三围"
                    :value="info.bust + '/' + info.waist + '/' + info.hip" />
                </n-gi> -->

                <n-gi>
                  <n-statistic label="综合评分" :value="info.score + ' / ' + info.personalScore" />
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
        <template #extra>
          <n-space>
            <n-button @click="openDrawer">{{ $t('common.modify') }}</n-button>
          </n-space>
        </template>
      </n-page-header>
    </n-gi>
    <n-gi :span="2">
      <NCard title="TA的作品">
        <NSpace>
          <MovieCard
            v-for="movie in movies"
            :key="movie.id"
            :movie="movie"
            :sort="searchData.sort"></MovieCard>
        </NSpace>

        <n-pagination
          class="mt-lg"
          v-model:page="searchData.page"
          v-model:page-size="searchData.pageSize"
          :page-count="pageCount"
          show-size-picker
          :page-sizes="pageSizeOptions"
          @update-page="handleSearch"
          @update-page-size="handleSearch" />
      </NCard>
    </n-gi>
    <n-gi>
      <n-drawer v-model:show="active" width="70%" placement="right">
        <n-drawer-content>
          <DetailDrawer :info="info" @close="closeDrawer"></DetailDrawer>
        </n-drawer-content>
      </n-drawer>

      <n-modal v-model:show="showModal" class="w-3xl!" preset="dialog" title="Dialog">
        <template #header>
          <n-text>修改头像</n-text>
        </template>
        <NSpace class="h-xl w-auto mt-lg">
          <n-card
            content-style="padding:0px !important"
            v-for="movie in movies"
            :key="movie.id"
            @click="updateActressAvatar(movie.poster)"
            hoverable>
            <img :src="movie.poster" class="w-24 h-36 cursor-pointer rd-md" />
          </n-card>
        </NSpace>
        <n-pagination
          class="mt-lg"
          v-model:page="searchData.page"
          v-model:page-size="searchData.pageSize"
          :page-count="pageCount"
          show-size-picker
          :page-sizes="pageSizeOptions"
          @update-page="handleSearch"
          @update-page-size="handleSearch" />
      </n-modal>
    </n-gi>
  </n-grid>
</template>
<script setup lang="ts">
import { cupOptions, pageSizeOptions } from '@renderer/constants/library'
import { useRouterPush } from '@renderer/hooks/common/router'
import { $t } from '@renderer/locales'
import { findActress, updateActress } from '@renderer/service/api/actress'
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
  videoCount: 0,
  bust: 0,
  waist: 0,
  hip: 0,
  face: 0,
  body: 0,
  cup: 0,
  bodySize: '',
  bodyHeight: 0,
  debutDate: ''
})

const movies = ref<Array<Dto.DbMovie>>([])
const age = ref(0)

const searchData = ref<Dto.MovieSearchOption>({
  sort: 'year',
  sortRule: 'DESC',
  page: 1,
  pageSize: 20
})
const pageCount = ref(1)
const totalMovies = ref(0)
function handleSearch() {
  searchData.value.actress = info.value.name
  fetchMoviePagedList(searchData.value).then((res) => {
    if (res.data) {
      movies.value = res.data.records
      pageCount.value = Math.ceil(res.data.total / searchData.value.pageSize)
      totalMovies.value = res.data.total
    } else {
      movies.value = []
      pageCount.value = 1
      totalMovies.value = 0
    }
  })
}

onMounted(() => {
  findActress(route.query.name as string).then((res) => {
    if (res.data != null) {
      info.value = res.data
      age.value = new Date().getFullYear() - parseInt(info.value.birthday.split('/')[0])
      // 查找作品
      handleSearch()
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

const showModal = ref(false)
function setAvatar() {
  showModal.value = true
}
function updateActressAvatar(poster: string) {
  info.value.avatar = poster
  updateActress(info.value).then((res) => {
    if (res.data) {
      window.$message?.success($t('common.modifySuccess'))
    }
  })
}
</script>

<style scoped></style>

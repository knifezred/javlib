<template>
  <NSpace vertical>
    <NCard :bordered="false" class="z-4 w-full h-20 rd-12px">
      <n-form
        label-placement="left"
        :label-width="85"
        require-mark-placement="right-hanging"
        size="small">
        <n-space item-style="display: flex;" align="center">
          <n-form-item :label="$t('page.library.searchKey')">
            <n-input-group>
              <n-input
                v-model:value="searchData.keyword"
                type="text"
                placeholder="请输入标题关键词"
                class="max-w-xl" />
            </n-input-group>
          </n-form-item>
          <n-form-item :label="$t('common.sort')">
            <n-select
              v-model:value="searchData.sort"
              :options="sortOptions"
              @update:value="handleSearch(currentTab)"
              class="w-40" />
          </n-form-item>
          <n-form-item>
            <n-select
              v-model:value="searchData.sortRule"
              :options="sortRuleOptions"
              @update:value="handleSearch(currentTab)"
              class="w-40" />
          </n-form-item>
          <n-form-item>
            <n-switch
              v-model:value="searchData.viewCount"
              v-on:update-value="handleSearch(currentTab)"
              :checked-value="0"
              :unchecked-value="-1">
              <template #checked> 未播放 </template>
              <template #unchecked> 全部 </template>
            </n-switch>
          </n-form-item>
          <n-form-item>
            <n-button type="primary" @click="handleSearch(currentTab)">
              {{ $t('common.search') }}
            </n-button>
          </n-form-item>
          <n-form-item>
            <n-button type="default" ghost @click="resetSearch">
              {{ $t('common.reset') }}
            </n-button>
          </n-form-item>
        </n-space>
      </n-form>
    </NCard>

    <n-tabs
      :value="currentTab"
      v-on:update:value="handleSearch"
      justify-content="space-evenly"
      type="card"
      animated>
      <n-tab-pane name="movie" :tab="$t('page.favorites.movie') + '（' + favCount.movie + '）'">
        <n-empty v-if="favCount.movie == 0" size="large" class="ma-auto" description="什么也没有">
          <template #icon>
            <n-icon>
              <SvgIcon icon="solar:hand-heart-bold-duotone" />
            </n-icon>
          </template>
        </n-empty>
        <NSpace class="ma-4">
          <MovieCard
            v-for="movie in favoritesData.movie"
            :key="movie.file"
            :movie="movie"
            sort="score"></MovieCard>
        </NSpace>
      </n-tab-pane>
      <n-tab-pane
        name="actress"
        :tab="$t('route.category_actress') + '（' + favCount.actress + '）'">
        <n-empty v-if="favCount.actress == 0" size="large" class="ma-auto" description="什么也没有">
          <template #icon>
            <n-icon>
              <SvgIcon icon="solar:hand-heart-bold-duotone" />
            </n-icon>
          </template>
        </n-empty>
        <NSpace class="ma-4">
          <ActressCard
            v-for="actress in favoritesData.actress"
            :key="actress.name"
            :show-second-title="true"
            :actress="actress"
            sort="score"></ActressCard>
        </NSpace>
      </n-tab-pane>
      <n-tab-pane name="studio" :tab="$t('route.category_studio') + '（' + favCount.studio + '）'">
        <n-empty v-if="favCount.studio == 0" size="large" class="ma-auto" description="什么也没有">
          <template #icon>
            <n-icon>
              <SvgIcon icon="solar:hand-heart-bold-duotone" />
            </n-icon>
          </template>
        </n-empty>
        <NSpace>
          <FavoriteCardGroup
            :keys="favoritesData.studio"
            storage-key="favorite_studio"
            type="studio" />
        </NSpace>
      </n-tab-pane>
      <n-tab-pane name="series" :tab="$t('route.category_series') + '（' + favCount.series + '）'">
        <n-empty v-if="favCount.series == 0" size="large" class="ma-auto" description="什么也没有">
          <template #icon>
            <n-icon>
              <SvgIcon icon="solar:hand-heart-bold-duotone" />
            </n-icon>
          </template>
        </n-empty>
        <NSpace>
          <FavoriteCardGroup
            :keys="favoritesData.series"
            storage-key="favorite_series"
            type="series" />
        </NSpace>
      </n-tab-pane>
    </n-tabs>

    <n-pagination
      v-if="showPagination"
      v-model:page="searchData.page"
      v-model:page-size="searchData.pageSize"
      :page-count="pageCount"
      show-size-picker
      :page-sizes="pageSizeOptions"
      @update-page="handleSearch(currentTab)"
      @update-page-size="handleSearch(currentTab)" />

  </NSpace>
</template>

<script setup lang="ts">
import ActressCard from '@renderer/components/custom/card/actress-card.vue'
import FavoriteCardGroup from '@renderer/components/custom/card/favorite-card-group.vue'
import MovieCard from '@renderer/components/custom/card/movie-card.vue'
import { pageSizeOptions, sortRuleOptions } from '@renderer/constants/library'
import { fetchActressPagedList, getFavoritesActressCount } from '@renderer/service/api/actress'
import { fetchMoviePagedList, getFavoriteMoviesCount } from '@renderer/service/api/movie'
import { findStorage } from '@renderer/service/api/storage'
import { useAppStore } from '@renderer/store/modules/app'
import { NSpace } from 'naive-ui'
import { onMounted, ref } from 'vue'

defineOptions({
  name: 'Favorites'
})
const appStore = useAppStore()
const favCount = ref({
  movie: 0,
  actress: 0,
  studio: 0,
  series: 0
})
const favoritesData = ref({
  movie: [] as Array<Dto.DbMovie>,
  actress: [] as Array<Dto.DbActress>,
  studio: [] as Array<string>,
  series: [] as Array<string>
})
const currentTab = ref('movie')
const showPagination = ref(true)
const searchData = ref({
  page: 1,
  pageSize: 16,
  keyword: '',
  name: '',
  viewCount: -1,
  sort: 'favoriteTime',
  sortRule: 'DESC',
  folder: null,
  favorite: true
})
const sortOptions = [
  {
    label: '收藏时间',
    value: 'favoriteTime'
  },
  {
    label: '更新时间',
    value: 'updatedTime'
  },
  {
    label: '年份',
    value: 'year'
  },
  {
    label: '番号',
    value: 'num'
  },
  {
    label: '综合评分',
    value: 'score'
  },
  {
    label: '个人评分',
    value: 'personalScore'
  },
  {
    label: '添加时间',
    value: 'createdTime'
  },
  {
    label: '上映时间',
    value: 'releaseTime'
  },
  {
    label: '播放次数',
    value: 'viewCount'
  }
]
const pageCount = ref(1)
function handleSearch(tab: string) {
  currentTab.value = tab
  appStore.setCacheSearchData({
    currentTab: currentTab.value,
    searchData: searchData.value
  })
  if (currentTab.value !== 'movie') {
    searchData.value.sort = 'updatedTime'
    searchData.value.name = searchData.value.keyword
  }
  switch (currentTab.value) {
    case 'movie':
      showPagination.value = true
      fetchMoviePagedList(searchData.value).then((res) => {
        if (res.data != null) {
          favoritesData.value.movie = res.data.records
          favCount.value.movie = res.data.total
          pageCount.value = Math.ceil(res.data.total / searchData.value.pageSize)
        } else {
          favoritesData.value.movie = []
          favCount.value.movie = 0
          pageCount.value = 0
        }
      })
      break
    case 'actress':
      fetchActressPagedList(searchData.value).then((res) => {
        if (res.data != null) {
          favoritesData.value.actress = res.data.records
          favCount.value.actress = res.data.total
          pageCount.value = Math.ceil(res.data.total / searchData.value.pageSize)
        } else {
          favoritesData.value.actress = []
          favCount.value.actress = 0
          pageCount.value = 0
        }
      })
      break
    default:
      showPagination.value = false
      break
  }
}
function resetSearch() {
  searchData.value = {
    keyword: '',
    name: '',
    viewCount: -1,
    favorite: true,
    folder: null,
    sort: 'favoriteTime',
    sortRule: 'DESC',
    pageSize: 16,
    page: 1
  }

  handleSearch(currentTab.value)
}
onMounted(() => {
  var cacheSearch = appStore.getCacheSearchData()
  if (cacheSearch) {
    currentTab.value = cacheSearch.data.currentTab
    searchData.value = cacheSearch.data.searchData
  }
  handleSearch(currentTab.value)

  getFavoriteMoviesCount().then((res) => {
    if (res.data) {
      favCount.value.movie = res.data
    } else {
      favCount.value.movie = 0
    }
  })
  getFavoritesActressCount().then((res) => {
    if (res.data) {
      favCount.value.actress = res.data
    } else {
      favCount.value.actress = 0
    }
  })
  findStorage('favorite_series').then((res) => {
    if (res.data) {
      favoritesData.value.series = res.data.value.split('|')
      favCount.value.series = favoritesData.value.series.length
    } else {
      favoritesData.value.series = []
      favCount.value.series = 0
    }
  })
  findStorage('favorite_studio').then((res) => {
    if (res.data) {
      favoritesData.value.studio = res.data.value.split('|')
      favCount.value.studio = favoritesData.value.studio.length
    } else {
      favoritesData.value.studio = []
      favCount.value.studio = 0
    }
  })
})
</script>

<style scoped></style>

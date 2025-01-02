<template>
  <n-flex vertical>
    <NCard :bordered="false" class="relative z-4 w-auto rd-12px">
      <n-collapse :default-expanded-names="['1']">
        <n-collapse-item :title="$t('common.search')" name="1">
          <n-form
            label-placement="left"
            :label-width="85"
            require-mark-placement="right-hanging"
            size="small">
            <n-form-item :label="$t('page.library.type')" class="h-10 hidden">
              <n-checkbox-group v-model:value="searchData.type">
                <n-space item-style="display: flex;" align="center">
                  <n-checkbox value="内地" label="内地" />
                  <n-checkbox value="港台" label="港台" />
                  <n-checkbox value="日本" label="日本" />
                </n-space>
              </n-checkbox-group>
            </n-form-item>
            <n-form-item :label="$t('page.library.tags')" class="h-10">
              <n-checkbox-group v-model:value="searchData.tags">
                <n-space item-style="display: flex;" align="center">
                  <n-checkbox
                    v-for="tag in typeOptions"
                    :key="tag.id"
                    :value="tag.key"
                    :label="tag.key" />
                </n-space>
              </n-checkbox-group>
            </n-form-item>
            <n-form-item :label="$t('page.library.yearGroup')" class="h-10">
              <n-checkbox-group v-model:value="searchData.years">
                <n-space item-style="display: flex;" align="center">
                  <n-checkbox value="2024" label="2024" />
                  <n-checkbox value="2023" label="2023" />
                  <n-checkbox value="2022" label="2022" />
                  <n-checkbox value="2021" label="2021" />
                  <n-checkbox value="2020" label="2020" />
                  <n-checkbox value="2019-2015" label="2019 - 2015" />
                  <n-checkbox value="2015-2010" label="2014 - 2010" />
                  <n-checkbox value="2009-2000" label="2009 - 2000" />
                  <n-checkbox value="1999-1990" label="90年代" />
                  <n-checkbox value="1989-1980" label="80年代" />
                  <n-checkbox value="1979-1900" label="更早" />
                </n-space>
              </n-checkbox-group>
            </n-form-item>
            <n-form-item :label="$t('page.library.searchKey')">
              <n-input-group>
                <n-input
                  v-model:value="searchData.keyword"
                  type="text"
                  placeholder="请输入标题关键词"
                  class="max-w-xl" />
              </n-input-group>
            </n-form-item>
            <n-space item-style="display: flex;" align="center">
              <n-form-item :label="$t('common.sort')">
                <n-select
                  v-model:value="searchData.sort"
                  :options="sortOptions"
                  @update:value="handleSearch"
                  class="w-40" />
              </n-form-item>
              <n-form-item>
                <n-select
                  v-model:value="searchData.sortRule"
                  :options="sortRuleOptions"
                  @update:value="handleSearch"
                  class="w-40" />
              </n-form-item>
              <n-form-item>
                <n-switch
                  v-model:value="searchData.viewCount"
                  v-on:update-value="handleSearch"
                  :checked-value="0"
                  :unchecked-value="-1">
                  <template #checked> 未播放 </template>
                  <template #unchecked> 全部 </template>
                </n-switch>
              </n-form-item>
              <n-form-item>
                <n-button type="primary" @click="handleSearch">
                  {{ $t('common.search') }}
                </n-button>
              </n-form-item>
              <n-form-item>
                <n-button type="default" ghost @click="resetSearch">
                  {{ $t('common.reset') }}
                </n-button>
              </n-form-item>
              <n-form-item>
                <n-button type="warning" @click="updateLibrary">
                  {{ $t('page.library.updateLibrary') }}
                </n-button>
              </n-form-item>
            </n-space>
            <n-form-item>
              <n-text>{{ '共找到 ' + totalCount + ' 部影片' }}</n-text>
            </n-form-item>
          </n-form>
        </n-collapse-item>
      </n-collapse>
    </NCard>
    <NSpace>
      <MovieCard
        v-for="movie in movieData"
        :key="movie.id"
        :movie="movie"
        :sort="searchData.sort"></MovieCard>
    </NSpace>
    <n-pagination
      v-model:page="searchData.page"
      v-model:page-size="searchData.pageSize"
      :page-count="pageCount"
      show-size-picker
      :page-sizes="pageSizeOptions"
      @update-page="handleSearch"
      @update-page-size="handleSearch" />
  </n-flex>
</template>

<script setup lang="ts">
import MovieCard from '@renderer/components/custom/card/movie-card.vue'
import { pageSizeOptions, sortRuleOptions } from '@renderer/constants/library'
import { $t } from '@renderer/locales'
import { fetchCategoryPagedList } from '@renderer/service/api/category'
import { fetchMoviePagedList, updateMovieLibrary } from '@renderer/service/api/movie'
import { useAppStore } from '@renderer/store/modules/app'
import { onMounted, ref } from 'vue'

defineOptions({
  name: 'Library'
})
const appStore = useAppStore()
const sortOptions = [
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
const totalCount = ref(0)

const searchData = ref<Dto.MovieSearchOption>({
  viewCount: 0,
  sort: 'createdTime',
  sortRule: 'DESC',
  pageSize: 20,
  page: 1
})
const movieData = ref<Array<Dto.DbMovie>>([])
async function handleSearch() {
  appStore.setCacheSearchData(searchData.value)
  fetchMoviePagedList(searchData.value).then((res) => {
    if (res.data != null) {
      movieData.value = res.data.records
      pageCount.value = Math.ceil(res.data.total / searchData.value.pageSize)
      totalCount.value = res.data.total
    } else {
      movieData.value = []
      pageCount.value = 1
      totalCount.value = 0
    }
  })
}

function resetSearch() {
  searchData.value = {
    years: null,
    keyword: '',
    type: null,
    tags: null,
    viewCount: 0,
    sort: 'createdTime',
    sortRule: 'DESC',
    pageSize: 20,
    page: 1
  }
  handleSearch()
}

function updateLibrary() {
  window.$message?.info('后台添加中，请耐心等待')
  updateMovieLibrary()
}

const typeOptions = ref<Array<Dto.DbCategory>>([])
function getTopTypes() {
  fetchCategoryPagedList({
    page: 1,
    pageSize: 10,
    type: 'tag',
    sort: 'value',
    sortRule: 'DESC'
  }).then((res) => {
    if (res.data) {
      typeOptions.value = res.data.records
    }
  })
}

onMounted(() => {
  var cacheSearch = appStore.getCacheSearchData()
  if (cacheSearch) {
    searchData.value = cacheSearch.data as Dto.MovieSearchOption
  }
  getTopTypes()
  handleSearch()
})
</script>

<style scoped></style>

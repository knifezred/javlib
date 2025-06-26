<template>
  <n-flex vertical>
    <NCard :bordered="false" class="relative z-4 rd-12px">
      <NForm label-placement="left" :label-width="85" require-mark-placement="right-hanging" size="small">
        <NSpace item-style="display: flex;" align="center">
          <NFormItem :label="$t('page.library.searchKey')">
            <NInputGroup>
              <NInput v-model:value="searchData.keyword" type="text" placeholder="请输入标题关键词" class="max-w-xl" />
            </NInputGroup>
          </NFormItem>
          <NFormItem>
            <NSelect
              v-model:value="searchData.tags"
              :options="tagOptions"
              :placeholder="$t('page.library.tags')"
              filterable
              clearable
              class="w-40"
              @update:value="handleSearch" />
          </NFormItem>
          <NFormItem>
            <NSelect
              v-model:value="searchData.years"
              :placeholder="$t('page.library.yearGroup')"
              class="w-35"
              clearable
              multiple
              max-tag-count="responsive"
              :options="[
                {
                  label: '2025',
                  value: '2025'
                },
                {
                  label: '2024',
                  value: '2024'
                },
                {
                  label: '2023',
                  value: '2023'
                },
                {
                  label: '2022',
                  value: '2022'
                },
                {
                  label: '2021',
                  value: '2021'
                },
                {
                  label: '2020',
                  value: '2020'
                },
                {
                  label: '2019 - 2015',
                  value: '2019-2015'
                },
                {
                  label: '2014 - 2010',
                  value: '2015-2010'
                },
                {
                  label: '2009 - 2000',
                  value: '2009-2000'
                },
                {
                  label: '90年代',
                  value: '1999-1990'
                },
                {
                  label: '80年代',
                  value: '1989-1980'
                },
                {
                  label: '更早',
                  value: '1979-1900'
                }
              ]"
              @update:value="handleSearch"></NSelect>
          </NFormItem>
          <NFormItem>
            <NSelect v-model:value="searchData.sort" :options="sortOptions" class="w-40" @update:value="handleSearch" />
          </NFormItem>
          <NFormItem>
            <NSelect
              v-model:value="searchData.sortRule"
              :options="sortRuleOptions"
              class="w-40"
              @update:value="handleSearch" />
          </NFormItem>
          <NFormItem>
            <NSwitch
              v-model:value="searchData.viewCount"
              :checked-value="0"
              :unchecked-value="-1"
              @update-value="handleSearch">
              <template #checked>未播放</template>
              <template #unchecked>全部</template>
            </NSwitch>
          </NFormItem>
          <NFormItem>
            <NSwitch
              v-model:value="searchData.favorite"
              :checked-value="true"
              :unchecked-value="undefined"
              @update-value="handleSearch">
              <template #checked>已收藏</template>
              <template #unchecked>全部</template>
            </NSwitch>
          </NFormItem>
          <NFormItem>
            <NButton type="primary" @click="handleSearch">
              {{ $t('common.search') }}
            </NButton>
          </NFormItem>
          <NFormItem>
            <NButton type="default" ghost @click="resetSearch">
              {{ $t('common.reset') }}
            </NButton>
          </NFormItem>
        </NSpace>
        <NText class="ml-8">{{ '共找到 ' + totalCount + ' 部影片' }}</NText>
      </NForm>
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
import { fetchMoviePagedList } from '@renderer/service/api/movie'
import { useAppStore } from '@renderer/store/modules/app'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'Library'
})
const appStore = useAppStore()
const route = useRoute()

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
  pageSize: 16,
  folder: null,
  page: 1
})
const movieData = ref<Array<Dto.DbMovie>>([])
async function handleSearch() {
  // 从query获取folder
  const folder = route.query.folder as string
  if (folder) {
    searchData.value.folder = folder
  } else {
    searchData.value.folder = null
  }
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
    favorite: null,
    folder: null,
    sort: 'createdTime',
    sortRule: 'DESC',
    pageSize: 16,
    page: 1
  }
  handleSearch()
}


const tagOptions = ref<Array<Dto.DbCategory>>([])
function getTopTypes() {
  fetchCategoryPagedList({
    page: 1,
    pageSize: 10,
    type: 'tag',
    sort: 'value',
    sortRule: 'DESC'
  }).then((res) => {
    if (res.data) {
      tagOptions.value = res.data.records
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

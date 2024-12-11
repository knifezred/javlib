<template>
  <n-flex vertical>
    <NCard :bordered="false" class="relative z-4 w-auto rd-12px">
      <n-collapse :default-expanded-names="['1']">
        <n-collapse-item :title="$t('common.search')" name="1">
          <n-form
            label-placement="left"
            label-width="auto"
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
                  <n-checkbox value="中文字幕" label="中文" />
                  <n-checkbox value="无码破解" label="破解" />
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
                <n-select v-model:value="searchData.sort" :options="sortOptions" class="w-40" />
              </n-form-item>
              <n-form-item>
                <n-select
                  v-model:value="searchData.sortRule"
                  :options="sortRuleOptions"
                  class="w-40" />
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
          </n-form>
        </n-collapse-item>
      </n-collapse>
    </NCard>
    <NSpace>
      <MovieCard v-for="movie in movieData" :key="movie.id" :movie="movie"></MovieCard>
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
import { onMounted, ref } from 'vue'

defineOptions({
  name: 'Library'
})

const sortOptions = [
  {
    label: '名称',
    value: 'title'
  },
  {
    label: '番号',
    value: 'num'
  },
  {
    label: '评分',
    value: 'score'
  },
  {
    label: '上映时间',
    value: 'releaseTime'
  },
  {
    label: '添加时间',
    value: 'createdTime'
  }
]

const pageCount = ref(1)

const searchData = ref<Dto.MovieSearchOption>({
  sort: 'createdTime',
  sortRule: 'DESC',
  pageSize: 20,
  page: 1
})
const movieData = ref<Array<Dto.DbMovie>>([])
async function handleSearch() {
  fetchMoviePagedList(searchData.value).then((res) => {
    if (res.data != null) {
      movieData.value = res.data.records
      pageCount.value = Math.ceil(res.data.total / searchData.value.pageSize)
    } else {
      movieData.value = []
      pageCount.value = 1
    }
  })
}

function resetSearch() {
  searchData.value = {
    years: [],
    keyword: '',
    type: [],
    tags: [],
    sort: 'createdTime',
    sortRule: 'DESC',
    pageSize: 20,
    page: 1
  }
  handleSearch()
}

async function updateLibrary() {
  window.$message?.info('后台添加中，请耐心等待')
  const count = await window.electron.ipcRenderer.invoke('update-movie-library')
  window.$message?.info($t('common.addSuccess') + ' (' + count + ')')
}

const typeOptions = ref<Array<Dto.DbCategory>>([])
function getTopTypes() {
  fetchCategoryPagedList({
    page: 1,
    pageSize: 8,
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
  getTopTypes()
  handleSearch()
})
</script>

<style scoped></style>

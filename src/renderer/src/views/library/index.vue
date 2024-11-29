<template>
  <n-flex vertical>
    <NCard :bordered="false" class="relative z-4 w-auto rd-12px">
      <n-form
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
        size="small">
        <n-form-item :label="$t('page.library.tags')" class="h-8">
          <n-checkbox-group :value="searchData.tags" @update:value="handleTagsUpdateValue">
            <n-space item-style="display: flex;" align="center">
              <n-checkbox value="中文" label="中文" />
              <n-checkbox value="破解" label="破解" />
              <n-checkbox value="4K" label="4K" />
              <n-checkbox value="VR" label="VR" />
            </n-space>
          </n-checkbox-group>
        </n-form-item>
        <n-form-item label="地区" class="h-8">
          <n-checkbox-group :value="searchData.type" @update:value="handleTypeUpdateValue">
            <n-space item-style="display: flex;" align="center">
              <n-checkbox value="内地" label="内地" />
              <n-checkbox value="港台" label="港台" />
              <n-checkbox value="日本" label="日本" />
            </n-space>
          </n-checkbox-group>
        </n-form-item>
        <n-form-item :label="$t('page.library.yearGroup')" class="h-8">
          <n-checkbox-group :value="searchData.years" @update:value="handleYearUpdateValue">
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
        <n-form-item :label="$t('page.library.searchKey')" class="h-10">
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
            <n-button type="primary" ghost @click="handleSearch">
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
    <NSpace class="min-h-70%">
      <NCard
        :bordered="false"
        size="small"
        class="relative z-4 w-48 h-86 rd-12px text-center"
        title="楚门的世界"
        hoverable>
        <template #cover>
          <img src="@renderer/assets/imgs/the.truman.show.jpg" />
        </template>
        <template #header-extra> <n-p depth="3" class="ma-0">1998</n-p> </template>
      </NCard>
      <NCard
        :bordered="false"
        size="small"
        class="relative z-4 w-48 h-86 rd-12px text-center"
        title="肖申克的救赎"
        hoverable>
        <template #cover>
          <img src="@renderer/assets/imgs/The.Shawshank.Redemption.1994.jpg" />
        </template>
        <template #header-extra> <n-p depth="3" class="ma-0">1994</n-p> </template>
      </NCard>
    </NSpace>
    <n-pagination
      v-model:page="page"
      v-model:page-size="pageSize"
      :page-count="10"
      show-size-picker
      :page-sizes="pageSizes" />
  </n-flex>
</template>

<script setup lang="ts">
import { $t } from '@renderer/locales'
import { ref } from 'vue'

defineOptions({
  name: 'Library'
})
const searchData = ref<Dto.MovieSearchOption>({
  tags: null,
  years: null,
  type: null,
  keyword: '',
  sort: 'nameAsc'
})

function handleTagsUpdateValue(value: (string | number)[]) {
  searchData.value.tags = value
  window.$message?.info(JSON.stringify(value))
}

function handleYearUpdateValue(value: (string | number)[]) {
  searchData.value.years = value
  window.$message?.info(JSON.stringify(value))
}

function handleTypeUpdateValue(value: (string | number)[]) {
  searchData.value.type = value
  window.$message?.info(JSON.stringify(value))
}
const sortOptions = [
  {
    label: '名称（A-Z）',
    value: 'nameAsc'
  },
  {
    label: '上映时间',
    value: 'releaseTime'
  },
  {
    label: '添加时间',
    value: 'addTime'
  }
]
function handleSearch() {
  window.$message?.info($t('common.lookForward'))
}
function resetSearch() {
  searchData.value.sort = 'nameAsc'
  searchData.value.tags = null
  searchData.value.years = null
  searchData.value.type = null
  searchData.value.keyword = ''
}

const pageSizes = [
  {
    label: '10 每页',
    value: 10
  },
  {
    label: '20 每页',
    value: 20
  },
  {
    label: '30 每页',
    value: 30
  },
  {
    label: '40 每页',
    value: 40
  }
]
const page = ref(1)
const pageSize = ref(10)
</script>

<style scoped></style>

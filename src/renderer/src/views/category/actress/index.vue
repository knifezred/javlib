<template>
  <NFlex vertical>
    <NCard :bordered="false" class="relative z-4 w-auto rd-12px">
      <n-collapse :default-expanded-names="['1']">
        <n-collapse-item :title="$t('common.search')" name="1">
          <n-form
            label-placement="left"
            label-width="auto"
            require-mark-placement="right-hanging"
            size="small">
            <n-form-item :label="$t('page.library.type')" class="h-8">
              <n-checkbox-group :value="searchData.type" @update:value="handleTypeUpdateValue">
                <n-space item-style="display: flex;" align="center">
                  <n-checkbox value="内地" label="内地" />
                  <n-checkbox value="港台" label="港台" />
                  <n-checkbox value="日本" label="日本" />
                </n-space>
              </n-checkbox-group>
            </n-form-item>
            <n-form-item :label="$t('page.library.tags')" class="h-8">
              <n-checkbox-group :value="searchData.tags" @update:value="handleTagsUpdateValue">
                <n-space item-style="display: flex;" align="center">
                  <n-checkbox value="中文字幕" label="中文" />
                  <n-checkbox value="无码破解" label="破解" />
                  <n-checkbox value="VR" label="VR" />
                </n-space>
              </n-checkbox-group>
            </n-form-item>
            <n-form-item :label="$t('page.library.searchKey')" class="h-10">
              <n-input-group>
                <n-input
                  v-model:value="searchData.name"
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
        </n-collapse-item>
      </n-collapse>
    </NCard>
    <NSpace>
      <ActressCard
        v-for="actress in actressData"
        :key="actress.id"
        :actress="actress"
        @show-detail="showActressInfo(actress)"></ActressCard>
    </NSpace>
    <n-pagination
      v-model:page="searchData.page"
      v-model:page-size="searchData.pageSize"
      :page-count="pageCount"
      show-size-picker
      :page-sizes="pageSizes"
      @update-page="handleSearch"
      @update-page-size="handleSearch" />
  </NFlex>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

defineOptions({
  name: 'Actress'
})
const actressData = ref<Array<Dto.DbActress>>([])

const sortOptions = [
  {
    label: '名称',
    value: 'name'
  }
]
const sortRuleOptions = [
  {
    label: '正序',
    value: 'ASC'
  },
  {
    label: '倒序',
    value: 'DESC'
  },
  {
    label: '随机',
    value: 'RAND'
  }
]
const pageSizes = [
  {
    label: '20 每页',
    value: 20
  },
  {
    label: '30 每页',
    value: 30
  },
  {
    label: '50 每页',
    value: 50
  },
  {
    label: '100 每页',
    value: 100
  }
]
const pageCount = ref(1)

const searchData = ref<Dto.ActressSearchOption>({
  tags: null,
  type: null,
  name: '',
  sort: 'name',
  sortRule: 'DESC',
  pageSize: 30,
  page: 1
})
function handleSearch() {
  console.log('search')
}

function resetSearch() {
  searchData.value.sortRule = 'DESC'
  searchData.value.sort = 'name'
  searchData.value.tags = null
  searchData.value.type = null
  searchData.value.name = ''
}
function handleTagsUpdateValue(value: (string | number)[]) {
  searchData.value.tags = value as string[]
}

function handleTypeUpdateValue(value: (string | number)[]) {
  searchData.value.type = value as string[]
}

function showActressInfo(actress: Dto.DbActress) {
  console.log(actress)
}
onMounted(() => {
  handleSearch()
})
</script>

<style scoped></style>

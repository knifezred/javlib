<template>
  <NFlex vertical>
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
            <n-form-item :label="$t('page.library.tags')" class="h-10 hidden">
              <n-checkbox-group v-model:value="searchData.tags">
                <n-space item-style="display: flex;" align="center">
                  <n-checkbox value="中文字幕" label="中文" />
                  <n-checkbox value="无码破解" label="破解" />
                  <n-checkbox value="VR" label="VR" />
                </n-space>
              </n-checkbox-group>
            </n-form-item>
            <n-space item-style="display: flex;" align="center">
              <n-form-item :label="$t('page.actress.bodySize')">
                <n-select
                  v-model:value="searchData.bodySize"
                  :options="bodySizeOptions"
                  clearable
                  class="w-40" />
              </n-form-item>
              <n-form-item>
                <n-select
                  v-model:value="searchData.cup"
                  :options="cupOptions"
                  class="w-40"
                  :placeholder="$t('page.actress.cup')"
                  clearable />
              </n-form-item>
              <n-form-item :label="$t('page.actress.body')">
                <NSlider v-model:value="searchData.body" range :step="0.5" :max="10" class="w-xs" />
              </n-form-item>
            </n-space>
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
              <n-form-item :label="$t('page.actress.face')">
                <NSlider v-model:value="searchData.face" range :step="0.5" :max="10" class="w-xs" />
              </n-form-item>
            </n-space>
            <n-form-item :label="$t('page.library.searchKey')" class="h-10">
              <n-input-group>
                <n-input
                  v-model:value="searchData.name"
                  type="text"
                  placeholder="请输入标题关键词"
                  class="max-w-3xl" />
              </n-input-group>
            </n-form-item>
            <n-space justify="center">
              <n-form-item>
                <n-p>共找到 {{ totalCount }} 位演员</n-p>
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
                <n-button type="primary" ghost @click="openDrawer">
                  {{ $t('common.add') }}
                </n-button>
              </n-form-item>
              <n-form-item>
                <n-button type="warning" @click="updateActressLib">
                  {{ $t('page.actress.updateActress') }}
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
        :show-second-title="true"></ActressCard>
    </NSpace>
    <n-pagination
      v-model:page="searchData.page"
      v-model:page-size="searchData.pageSize"
      :page-count="pageCount"
      show-size-picker
      :page-sizes="pageSizeOptions"
      @update-page="handleSearch"
      @update-page-size="handleSearch" />
    <n-drawer v-model:show="active" width="70%" placement="right">
      <n-drawer-content>
        <DetailDrawer @close="closeDrawer"></DetailDrawer>
      </n-drawer-content>
    </n-drawer>
  </NFlex>
</template>

<script setup lang="ts">
import ActressCard from '@renderer/components/custom/card/actress-card.vue'
import {
  bodySizeOptions,
  cupOptions,
  pageSizeOptions,
  sortRuleOptions
} from '@renderer/constants/library'
import { $t } from '@renderer/locales'
import { createActress, fetchActressPagedList, findActress } from '@renderer/service/api/actress'
import { findAllActress } from '@renderer/service/api/movie'
import { onMounted, ref } from 'vue'
import DetailDrawer from './module/detail-drawer.vue'

defineOptions({
  name: 'Actress'
})

const sortOptions = [
  {
    label: '更新时间',
    value: 'updatedTime'
  },
  {
    label: '名称',
    value: 'name'
  },
  {
    label: '综合评分',
    value: 'score'
  },
  {
    label: '个人评分',
    value: 'personalScore'
  }
]

const pageCount = ref(1)
const totalCount = ref(0)

const searchData = ref<Dto.ActressSearchOption>({
  face: [0, 10],
  body: [0, 10],
  sort: 'updatedTime',
  sortRule: 'DESC',
  pageSize: 30,
  page: 1
})

const actressData = ref<Array<Dto.DbActress>>([])
function handleSearch() {
  fetchActressPagedList(searchData.value).then((res) => {
    if (res.data != null) {
      actressData.value = res.data.records
      pageCount.value = Math.ceil(res.data.total / searchData.value.pageSize)
      totalCount.value = res.data.total
    } else {
      actressData.value = []
      pageCount.value = 1
    }
  })
}

function resetSearch() {
  searchData.value = {
    tags: undefined,
    type: undefined,
    body: [0, 10],
    face: [0, 10],
    bodySize: null,
    cup: null,
    name: '',
    sort: 'updatedTime',
    sortRule: 'DESC',
    pageSize: 30,
    page: 1
  }
  handleSearch()
}

function updateActressLib() {
  // 获取所有影片的演员
  findAllActress().then((res) => {
    if (res.data != null) {
      const actressNames: string[] = []
      res.data.forEach((movie) => {
        movie.actress
          .split('|')
          .filter((x) => x.length > 0)
          .forEach((actressName) => {
            if (!actressNames.includes(actressName)) {
              actressNames.push(actressName)
            }
          })
      })
      actressNames.forEach((actressName) => {
        var actressMovie = res.data.find((x) => x.actress.includes('|' + actressName + '|'))
        findActress(actressName).then((rr) => {
          if (rr.data == null) {
            createActress({
              createdTime: new Date().getTime(),
              favorite: false,
              score: 0,
              personalScore: 0,
              category: '',
              name: actressName,
              alias: '',
              introduction: '',
              avatar: actressMovie ? actressMovie.poster : '',
              cover: '',
              tags: '',
              birthday: '',
              hasVideo: true,
              bust: 0,
              waist: 0,
              hip: 0,
              face: 0,
              body: 0,
              cup: 0,
              bodySize: '正常',
              bodyHeight: 0,
              debutDate: actressMovie ? new Date(actressMovie.year).getTime() : 0
            })
          }
        })
      })
    }
  })
}

const active = ref(false)
function openDrawer() {
  active.value = true
}
function closeDrawer() {
  active.value = false
}

onMounted(() => {
  handleSearch()
})
</script>

<style scoped></style>

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
        v-for="movie in movieData"
        :key="movie.file"
        :bordered="false"
        size="small"
        class="relative z-4 w-48 h-86 rd-12px text-center"
        :title="movie.title"
        hoverable
        @click="showMovieInfo(movie)">
        <template #cover>
          <img :src="movie.cover" />
        </template>
        <template #header-extra>
          <n-p depth="3" class="ma-0">{{ movie.year }}</n-p>
        </template>
      </NCard>
    </NSpace>
    <n-pagination
      v-model:page="page"
      v-model:page-size="pageSize"
      :page-count="10"
      show-size-picker
      :page-sizes="pageSizes" />

    <n-drawer v-model:show="active" width="70%" placement="right">
      <n-drawer-content title="Video Detail">
        <VideoPage :info="currentMovieInfo"></VideoPage>
      </n-drawer-content>
    </n-drawer>
  </n-flex>
</template>

<script setup lang="ts">
import { $t } from '@renderer/locales'
import { ref } from 'vue'
import VideoPage from './modules/video-page.vue'

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
const movieData = ref<Array<Dto.MovieInfo>>([
  {
    title: '楚门的世界',
    originTitle: 'The Shawshank Redemption',
    introduction: 'test',
    file: 'D:\\BaiduNetdiskDownload\\The Truman Show.mp4',
    torrent: '',
    cover: 'D:/BaiduNetdiskDownload/folder.jpg',
    poster: 'D:/BaiduNetdiskDownload/folder.jpg',
    tags: [],
    brand: '',
    series: '',
    actor: '',
    actors: [],
    director: '',
    year: 1998,
    releaseTime: '',
    addTime: '',
    viewCount: 0,
    favorite: true,
    score: 10,
    personalScore: 0
  },
  {
    title: '肖申克的救赎',
    originTitle: 'The Shawshank Redemption',
    introduction:
      '《肖申克的救赎》是由Castle Rock Entertainment出品，弗兰克·德拉邦特执导，斯蒂芬·埃德温·金、弗兰克·德拉邦特编剧，蒂姆·罗宾斯、摩根·弗里曼领衔主演的美国剧情片。该片于1994年9月10日在多伦多电影节首映，9月23日在美国上映。该片改编自斯蒂芬·埃德温·金1982年的中篇小说《肖申克的救赎》，主要讲述了银行家安迪因被误判为枪杀妻子及其情人的罪名入狱后，他不动声色、步步为营地谋划自我拯救并最终成功越狱，重获自由的故事 。',
    file: 'D://BaiduNetdiskDownload/The.Shawshank.Redemption.mp4',
    torrent: '',
    cover: 'D://BaiduNetdiskDownload/The.Shawshank.Redemption.1994.jpg',
    poster: 'D://BaiduNetdiskDownload/The.Shawshank.Redemption.1994.jpg',
    tags: [],
    brand: 'Castle Rock Entertainment',
    series: '',
    actor: '蒂姆·罗宾斯',
    actors: ['蒂姆·罗宾斯', '摩根·弗里曼'],
    director: '弗兰克·德拉邦特',
    year: 1994,
    releaseTime: '1994年9月10日',
    addTime: '2024年11月29日 16:11:25',
    viewCount: 0,
    favorite: false,
    score: 10,
    personalScore: 0
  }
])
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

const active = ref(false)
const currentMovieInfo = ref()
function showMovieInfo(movie: any) {
  currentMovieInfo.value = movie
  active.value = true
}
</script>

<style scoped></style>

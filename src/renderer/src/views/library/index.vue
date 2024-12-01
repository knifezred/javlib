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
            <n-form-item :label="$t('page.library.tags')" class="h-8">
              <n-checkbox-group :value="searchData.tags" @update:value="handleTagsUpdateValue">
                <n-space item-style="display: flex;" align="center">
                  <n-checkbox value="中文字幕" label="中文" />
                  <n-checkbox value="无码破解" label="破解" />
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
      <NCard
        v-for="movie in movieData"
        :key="movie.file"
        :bordered="false"
        size="small"
        class="relative z-4 w-40 rd-12px text-center"
        hoverable
        @click="showMovieInfo(movie)">
        <template #cover>
          <img :src="movie.poster" class="w-40 h-60 hover:transform-scale-120 blur-lg" />
        </template>
        <n-p class="ma-0 line-clamp-2">{{ movie.title }}</n-p>
        <n-p depth="3" class="ma-0">{{ movie.year }} ({{ movie.score }})</n-p>
      </NCard>
    </NSpace>
    <n-pagination
      v-model:page="page"
      v-model:page-size="pageSize"
      :page-count="pageCount"
      show-size-picker
      :page-sizes="pageSizes"
      @update-page="handleSearch"
      @update-page-size="handleSearch" />

    <n-drawer v-model:show="active" width="70%" placement="right">
      <n-drawer-content>
        <VideoPage :info="currentMovieInfo"></VideoPage>
      </n-drawer-content>
    </n-drawer>
  </n-flex>
</template>

<script setup lang="ts">
import { $t } from '@renderer/locales'
import {
  createMovie,
  fetchMoviePagedList,
  findMovie,
  updateMovie
} from '@renderer/service/api/movie'
import { findStorage } from '@renderer/service/api/storage'
import { onMounted, ref } from 'vue'
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
  searchData.value.tags = value as string[]
  window.$message?.info(JSON.stringify(value))
}

function handleYearUpdateValue(value: (string | number)[]) {
  searchData.value.years = value as string[]
  window.$message?.info(JSON.stringify(value))
}

function handleTypeUpdateValue(value: (string | number)[]) {
  searchData.value.type = value as string[]
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
const movieData = ref<Array<Dto.DbMovie>>([])

async function handleSearch() {
  movieData.value = []
  fetchMoviePagedList({
    year: searchData.value.years,
    page: page.value,
    pageSize: pageSize.value
  }).then((res) => {
    movieData.value = res.data.items
    pageCount.value = Math.ceil(res.data.total / pageSize.value)
  })
}

async function updateLibrary() {
  // 读取所有文件夹
  const tagIndex = await findStorage('tag_index')
  let arrTags = [] as string[]
  if (tagIndex.data != null) {
    arrTags = tagIndex.data.value.split('\n')
  }
  findStorage('media_folders').then((res) => {
    if (res.data && res.data.id) {
      const titleRegex = /^<title>(.*?)<\/title>$/
      const originalTitleRegex = /^<originaltitle>(.*?)<\/originaltitle>$/
      const ratingRegex = /^<rating>(.*?)<\/rating>$/
      const plotRegex = /^<plot>(.*?)<\/plot>$/
      const premieredRegex = /^<premiered>(.*?)<\/premiered>$/
      const tagRegex = /^<tag>(.*?)<\/tag>$/
      const genreRegex = /^<genre>(.*?)<\/genre>$/
      const studioRegex = /^<studio>(.*?)<\/studio>$/
      const directorRegx = /^<director>(.*?)<\/director>$/
      const countryRegx = /^<country>(.*?)<\/country>$/
      const numRegex = /^<uniqueid.*>(.*?)<\/uniqueid>$/
      const nameRegex = /^<name>(.*?)<\/name>$/
      const folders = res.data.value.split('\n')
      folders.forEach(async (folder) => {
        const files = await window.api.listDir(folder)
        files.forEach(async (file) => {
          // 读取nfo文件
          if (file.endsWith('.nfo')) {
            const data = await window.api.readFile(file)
            const lines = data.split('\n')
            const movieInfo: Dto.MovieInfo = {
              title: '',
              originTitle: '',
              introduction: '',
              file: '',
              torrent: '',
              cover: '',
              poster: '',
              tags: '',
              studio: '',
              series: '',
              genres: '',
              actor: '',
              director: '',
              year: 0,
              releaseTime: '',
              score: 0,
              country: '',
              uniqueid: '',
              num: '',
              fileSize: 0
            }
            let isSet = false
            let isActor = false
            lines.forEach((line) => {
              line = line.trim()
              if (titleRegex.test(line)) {
                movieInfo.title = getMatchContent(line, titleRegex)
              } else if (originalTitleRegex.test(line)) {
                movieInfo.originTitle = getMatchContent(line, originalTitleRegex)
              } else if (ratingRegex.test(line)) {
                movieInfo.score = parseFloat(getMatchContent(line, ratingRegex))
              } else if (plotRegex.test(line)) {
                movieInfo.introduction = getMatchContent(line, plotRegex)
              } else if (premieredRegex.test(line)) {
                movieInfo.releaseTime = getMatchContent(line, premieredRegex)
                movieInfo.year = parseInt(movieInfo.releaseTime.substring(0, 4))
              } else if (tagRegex.test(line)) {
                movieInfo.tags += replaceTag(getMatchContent(line, tagRegex), arrTags)
              } else if (genreRegex.test(line)) {
                movieInfo.genres += replaceTag(getMatchContent(line, genreRegex), arrTags)
              } else if (directorRegx.test(line)) {
                movieInfo.director = getMatchContent(line, directorRegx)
              } else if (countryRegx.test(line)) {
                movieInfo.country = getMatchContent(line, countryRegx)
              } else if (studioRegex.test(line)) {
                movieInfo.studio = getMatchContent(line, studioRegex)
              } else if (line.startsWith('<uniqueid type="num"')) {
                movieInfo.num = getMatchContent(line, numRegex)
              } else if (line.startsWith('<uniqueid type="cid"')) {
                movieInfo.uniqueid = getMatchContent(line, numRegex)
              } else if (line == '<set>') {
                isSet = true
              } else if (line == '</set>') {
                isSet = false
              } else if (line == '<actor>') {
                isActor = true
              } else if (line == '</actor>') {
                isActor = false
              } else if (isSet && line.startsWith('<name>')) {
                movieInfo.series = getMatchContent(line, nameRegex)
              } else if (isActor && line.startsWith('<name>')) {
                movieInfo.actor += '|' + getMatchContent(line, nameRegex)
              }
            })
            if (movieInfo.num != '') {
              if (movieInfo.tags.length > 0) {
                movieInfo.tags += '|'
              }
              if (movieInfo.actor.length > 0) {
                movieInfo.actor += '|'
              }
              if (movieInfo.genres.length > 0) {
                movieInfo.genres += '|'
              }
              // 找封面文件
              const folder = window.api.getDirectoryFromPath(file)
              files
                .filter((x) => x.startsWith(folder))
                .forEach((dirFile) => {
                  if (dirFile.endsWith('.jpg')) {
                    if (dirFile.includes('poster')) {
                      movieInfo.poster = dirFile
                    } else if (dirFile.includes('fanart')) {
                      movieInfo.cover = dirFile
                    } else {
                      movieInfo.poster = dirFile
                    }
                  }
                  // 兼容多视频
                  if (dirFile.endsWith('.mp4') || dirFile.endsWith('.mkv')) {
                    movieInfo.file += dirFile + ','
                    if (dirFile.includes('-C.') || dirFile.includes('-UC.')) {
                      movieInfo.tags += '|' + '中文字幕'
                    }
                    if (dirFile.includes('-UC.') || dirFile.includes('-U.')) {
                      movieInfo.tags += '|' + '无码破解'
                    }
                    const stats = window.api.getFileStats(dirFile)
                    if (stats != null) {
                      movieInfo.fileSize += stats.size
                    }
                  }
                })
            }
            findMovie(movieInfo.num).then((res) => {
              if (res.data == null || res.data.id == undefined) {
                const dbMovie = {
                  ...movieInfo,
                  isDelete: false,
                  favorite: false,
                  personalScore: 0,
                  viewCount: 0
                } as Dto.DbMovie
                createMovie(dbMovie)
              } else {
                const updateMovieInfo = {
                  ...movieInfo,
                  isDelete: false,
                  favorite: res.data.favorite,
                  personalScore: res.data.personalScore,
                  viewCount: res.data.viewCount
                } as Dto.DbMovie
                updateMovie(updateMovieInfo)
              }
            })
          }
        })
      })
      window.$message?.info($t('common.updateSuccess'))
    }
  })
}
function getMatchContent(line: string, reg: RegExp) {
  const matches = line.match(reg)
  if (matches != null && matches.length >= 1) {
    return matches[1]
  } else {
    return ''
  }
}
function replaceTag(tag: string, arrTags: Array<string>) {
  const replaceTag = arrTags.find((x) => x.startsWith(tag + '|'))
  if (replaceTag == undefined) {
    return '|' + tag
  } else {
    if (replaceTag.split('|')[1] == '删除') {
      return ''
    } else {
      return '|' + replaceTag.split('|')[1]
    }
  }
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
const page = ref(1)
const pageCount = ref(1)
const pageSize = ref(20)

const active = ref(false)
const currentMovieInfo = ref()
function showMovieInfo(movie: any) {
  currentMovieInfo.value = movie
  active.value = true
}

onMounted(() => {
  handleSearch()
})
</script>

<style scoped></style>

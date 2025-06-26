<template>
  <n-flex vertical>
    <NSpace>
      <NCard :bordered="false" size="small"
        class="relative z-4 w-96 rd-12px text-center cursor-pointer hover:shadow-lg hover:-translate-y-2 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        hoverable
        v-for="item in topFolders" :key="item" :title="getFolderName(item.folder)"
        @click="searchFolderVideos(item.folder)">
        <template #cover>
          <div class="flex gap-0 justify-between w-full">
            <!-- 循环展示3个封面图 -->
            <img
              v-for="(img, index) in item.cover"
              :key="index"
              :src="appStore.projectSettings.serviceUrl + img.replace('\\', '/')"
              class="h-48 w-32 flex-1 object-cover" />
          </div>
        </template>
      </NCard>
    </NSpace>
  </n-flex>
</template>

<script setup lang="ts">
import { useRouterPush } from '@renderer/hooks/common/router'
import { findStorage } from '@renderer/service/api/storage'
import { getFolderCover } from '@renderer/service/api/movie'
import { useAppStore } from '@renderer/store/modules/app'
import { onMounted, ref } from 'vue'

defineOptions({
  name: 'Folder'
})

const media_folders = ref<Array<string>>([])
const routerPush = useRouterPush()
const appStore = useAppStore()

/**
 * 获取路径中的最后一级目录名称
 * @param folderPath - 完整目录路径
 * @returns 最后一级目录名称
 */
function getFolderName(folderPath: string) {
  // 使用正则表达式匹配所有路径分隔符（兼容Windows和Unix系统）
  const pathParts = folderPath.split(/[\\/]+/)

  // 过滤空值并取最后一个有效部分
  const validParts = pathParts.filter(p => p.trim().length > 0)
  return validParts.length > 0
    ? validParts[validParts.length - 1]
    : ''
}

function searchFolderVideos(folder: string) {
  if (folder.startsWith("/app/public")) {
    folder = folder.replace("/app/public", "")
  }
  routerPush.routerPushByKey('library', { query: { folder: folder } })
}

const topFolders = ref([] as any[])
onMounted(() => {
  findStorage('media_folders').then(res => {
    if (res.data && res.data.id) {
      media_folders.value = res.data.value.split('\n')
      media_folders.value.forEach(folder => {
        getFolderCover(folder).then(coverResult => {
          const imgList: string[] = []
          if (coverResult !== null && coverResult.data !== null && coverResult.data) {
            coverResult.data.data.forEach(cover => {
              imgList.push(`${folder.replace('/app/public', '')}/${cover.replace('\\', '/')}`)
            })
          }
          topFolders.value.push({
            folder,
            cover: imgList
          } as never)
          console.log(topFolders.value)
        })
      })
    }
  })
})
</script>

<style scoped></style>

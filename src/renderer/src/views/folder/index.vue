<template>
    <n-flex vertical>
        <NSpace>
            <NCard :bordered="false" size="small" class="relative z-4 w-96 rd-12px text-center cursor-pointer hover:shadow-lg hover:-translate-y-2 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]" hoverable
                v-for="item in media_folders" :key="item" :title="getFolderName(item)"
                @click="searchFolderVideos(item)">
                <template #cover>
                    <div class="flex gap-0 justify-between w-full">
                        <!-- 循环展示3个封面图 -->
                        <img
                            v-for="(img, index) in getFolderCover(item)"
                            :key="index"
                            :src="img"
                            class="flex-1 w-32 h-48 object-cover">
                    </div>
                </template>
            </NCard>
        </NSpace>
    </n-flex>
</template>

<script setup lang="ts">
import { useRouterPush } from '@renderer/hooks/common/router'
import { findStorage } from '@renderer/service/api/storage'
import { onMounted, ref } from 'vue'

defineOptions({
    name: 'Folder'
})

const media_folders = ref<Array<string>>([])
const routerPush = useRouterPush()

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

function getFolderCover(folderPath: string) {
    var imgList: string[] = []
    // 从目录下取一张图片
    var files = window.api.listDir(folderPath)
    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            if (file.endsWith("poster.jpg") || file.endsWith("poster.png") || file.endsWith("poster.webp")) {
                imgList.push(file)
                if (imgList.length >= 3) {
                    return imgList
                }
            }
        }
    }
    return imgList
}

function searchFolderVideos(folder: string) {
    routerPush.routerPushByKey('library', { query: { folder: folder } })
}

onMounted(() => {
    findStorage('media_folders').then((res) => {
        if (res.data && res.data.id) {
            media_folders.value = res.data.value.split("\n")
        }
    })
})
</script>

<style scoped></style>

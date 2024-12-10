<template>
  <NSpace>
    <NCard
      v-for="item in keys"
      :key="item"
      :bordered="false"
      class="relative z-4 w-auto rd-12px cursor-pointer text-center text-center transition-transform duration-300 hover:transform-translate-y--2">
      <n-p class="inline cursor-pointer" @click="showMovieList(item)">
        {{ item }}
      </n-p>
      <n-button text class="font-size-4 ml-2" @click="changeFavorite(item)">
        <n-icon>
          <SvgIcon
            class="inline-flex"
            :icon="
              favoritesValue.includes(item)
                ? 'fluent-emoji-flat:heart-suit'
                : 'fluent-emoji-flat:grey-heart'
            ">
          </SvgIcon>
        </n-icon>
      </n-button>
    </NCard>
  </NSpace>
</template>

<script setup lang="ts">
import { useRouterPush } from '@renderer/hooks/common/router'
import { createStorage, findStorage, updateStorage } from '@renderer/service/api/storage'
import { onMounted, ref } from 'vue'

defineOptions({
  name: 'FavoriteCardGroup'
})
interface Props {
  type: string
  keys: string[]
  storageKey: string
}

const props = defineProps<Props>()
const { routerPushByKey } = useRouterPush()
const queryObj = ref({})
function showMovieList(item: string) {
  queryObj.value[props.type] = item
  console.log(queryObj)
  routerPushByKey('detail-page_video-list', {
    query: queryObj.value
  })
}
const favoritesData = ref<Dto.DbStorage>()
const favoritesValue = ref<Array<string>>([])
function changeFavorite(item: string) {
  if (favoritesData.value == undefined) {
    favoritesValue.value.push(item)
    createStorage({
      key: props.storageKey,
      value: item
    }).then(() => {
      findStorage(props.storageKey).then((rr) => {
        if (rr.data) {
          favoritesData.value = rr.data
        }
      })
    })
  } else {
    if (favoritesValue.value.includes(item)) {
      favoritesValue.value = favoritesValue.value.filter((x) => x != item)
    } else {
      favoritesValue.value.push(item)
    }
    favoritesData.value.value = favoritesValue.value.join('|')
    updateStorage(favoritesData.value)
  }
}
onMounted(() => {
  findStorage(props.storageKey).then((res) => {
    if (res.data) {
      favoritesValue.value = res.data.value.split('|')
      favoritesData.value = res.data
    } else {
      favoritesValue.value = []
    }
  })
})
</script>

<style scoped></style>

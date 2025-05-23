<template>
  <NSpace>
    <div
      v-for="info in categories"
      :key="info.id"
      class="relative w-auto rd-md text-center text-lg transition-transform duration-300 hover:transform-translate-y--2"
      hoverable>
      <n-text
        :depth="3"
        class="cursor-pointer color-warning-200 border-b-primary border-b-style-solid border-b-2"
        @click="showDetail(info)">
        {{ info.key }}
      </n-text>
      <n-button text class="font-size-4 ml-2" @click="setFavorite(info)">
        <n-icon>
          <SvgIcon
            class="inline-flex"
            :icon="
              info.favorite ? 'fluent-emoji-flat:heart-suit' : 'fluent-emoji-flat:grey-heart'
            "></SvgIcon>
        </n-icon>
      </n-button>
    </div>
  </NSpace>
</template>
<script lang="ts" setup>
import { useRouterPush } from '@renderer/hooks/common/router'
import { $t } from '@renderer/locales'
import { fetchCategoryPagedList, updateCategory } from '@renderer/service/api/category'
import { onMounted, ref, watch } from 'vue'

defineOptions({
  name: 'CategoryCardGroup'
})
interface Props {
  type: string
  keys: string
}

const props = defineProps<Props>()

const categories = ref<Array<Dto.DbCategory>>([])
function setFavorite(category: Dto.DbCategory) {
  category.favorite = !category.favorite
  updateCategory(category).then((res) => {
    if (res.data) {
      window.$message?.success(
        category.favorite ? $t('common.addFavorite') : $t('common.removeFavorite')
      )
    }
  })
}
const routerPush = useRouterPush()
function showDetail(entity: Dto.DbCategory) {
  routerPush.routerPushByKey('detail-page_video-list', {
    query: { key: entity.key, type: entity.type }
  })
}

watch(
  () => props.keys,
  () => {
    handleSearch()
  },
  { immediate: true }
)

function handleSearch() {
  if (props.keys.length > 0) {
    fetchCategoryPagedList({
      type: props.type,
      keys: props.keys,
      page: 1,
      pageSize: 10,
      sort: 'key',
      sortRule: 'ASC'
    }).then((res) => {
      if (res.data) {
        categories.value = res.data.records
      } else {
        categories.value = []
      }
    })
  }
}
onMounted(() => {
  handleSearch()
})
</script>

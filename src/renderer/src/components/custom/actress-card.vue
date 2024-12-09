<template>
  <NCard
    :bordered="false"
    size="small"
    class="relative z-4 w-32 rd-12px text-center"
    hoverable
    @click="showDetail(actress)">
    <template #cover>
      <img
        :src="actress.avatar"
        class="w-32 h-32 object-cover transition-transform duration-300 hover:transform-rotate-360" />
    </template>
    <n-p class="py-1">{{ actress.name }}</n-p>
  </NCard>
</template>
<script lang="ts" setup>
import { useRouterPush } from '@renderer/hooks/common/router'

defineOptions({
  name: 'ActressCard'
})
interface Props {
  /** Button class */
  actress: Dto.DbActress
}
defineProps<Props>()

const routerPush = useRouterPush()
function showDetail(entity: Dto.DbActress) {
  routerPush.routerPushByKey('detail-page_actress', { query: { name: entity.name } })
}
</script>

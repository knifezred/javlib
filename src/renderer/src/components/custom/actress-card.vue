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
        class="w-32 h-32 transition-transform duration-300 hover:transform-rotate-360" />
    </template>
    <n-p class="ma-0 line-clamp-2">{{ actress.name }}</n-p>
  </NCard>
</template>
<script lang="ts" setup>
defineOptions({
  name: 'ActressCard'
})
interface Props {
  /** Button class */
  actress: Dto.DbActress
}
defineProps<Props>()

interface Emits {
  (e: 'show-detail', actress: Dto.DbActress): Dto.DbActress
}

const emit = defineEmits<Emits>()

function showDetail(actress: Dto.DbActress) {
  emit('show-detail', actress)
}
</script>

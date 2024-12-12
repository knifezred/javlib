<template>
  <NCard
    :bordered="false"
    size="small"
    class="relative z-4 w-36 rd-md text-center transition-transform duration-300 hover:transform-translate-y--2"
    hoverable>
    <template #cover>
      <img
        v-if="actress.avatar == ''"
        src="@renderer/assets/imgs/default-avatar.png"
        class="w-36 h-36 cursor-pointer object-cover"
        @click="showDetail(actress)" />
      <img
        v-else
        :src="actress.avatar"
        class="w-36 h-36 cursor-pointer object-cover object-top"
        @click="showDetail(actress)" />
    </template>
    <n-p class="ma-0 pt-1 line-clamp-1 cursor-pointer" @click="showDetail(actress)">
      {{ actress.name }}
    </n-p>
    <n-p v-show="showSecondTitle" depth="3" class="ma-0">
      ({{ actress.score }})
      <n-button text class="font-size-4" @click="setFavorite">
        <n-icon>
          <SvgIcon
            class="inline-flex"
            :icon="
              favorite ? 'fluent-emoji-flat:heart-suit' : 'fluent-emoji-flat:grey-heart'
            "></SvgIcon>
        </n-icon>
      </n-button>
    </n-p>
  </NCard>
</template>
<script lang="ts" setup>
import { useRouterPush } from '@renderer/hooks/common/router'
import { $t } from '@renderer/locales'
import { updateActress } from '@renderer/service/api/actress'
import { onMounted, ref } from 'vue'

defineOptions({
  name: 'ActressCard'
})
interface Props {
  /** Button class */
  actress: Dto.DbActress
  showSecondTitle: boolean
}

const props = defineProps<Props>()
const favorite = ref(false)
function setFavorite() {
  const temp = props.actress
  favorite.value = !favorite.value
  temp.favorite = favorite.value
  updateActress(temp).then((res) => {
    if (res.data) {
      window.$message?.success(
        temp.favorite ? $t('common.addFavorite') : $t('common.removeFavorite')
      )
    }
  })
}
const routerPush = useRouterPush()
function showDetail(entity: Dto.DbActress) {
  routerPush.routerPushByKey('detail-page_actress', { query: { name: entity.name } })
}
onMounted(() => {
  favorite.value = props.actress.favorite
})
</script>

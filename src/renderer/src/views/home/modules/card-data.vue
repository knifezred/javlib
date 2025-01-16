<script setup lang="ts">
import { useRouterPush } from '@renderer/hooks/common/router'
import { $t } from '@renderer/locales'
import { getActressTotalCount } from '@renderer/service/api/actress'
import { getFavoriteMoviesCount, getTotalFileSize, getTotalVideoCount } from '@renderer/service/api/movie'
import { createReusableTemplate } from '@vueuse/core'
import { computed, onMounted, ref } from 'vue'

defineOptions({
  name: 'CardData'
})

interface CardData {
  key: string
  title: string
  value: number
  unit: string
  color: {
    start: string
    end: string
  }
  icon: string
}

const totalActressCount = ref(0)
const totalFileSize = ref(0)
const totalVideoCount = ref(0)
const totalFavoriteCount = ref(0)
const cardData = computed<CardData[]>(() => [
  {
    key: '/category/actress',
    title: $t('page.home.friendCount'),
    value: totalActressCount.value,
    unit: '',
    color: {
      start: '#ec4786',
      end: '#b955a4'
    },
    icon: 'fluent-color:people-24'
  },
  {
    key: '/library',
    title: $t('page.home.movieCount'),
    value: totalVideoCount.value,
    unit: '',
    color: {
      start: '#56cdf3',
      end: '#719de3'
    },
    icon: 'fluent-color:video-24'
  },
  {
    key: '/favorites',
    title: $t('page.home.favoriteCount'),
    value: totalFavoriteCount.value,
    unit: '',
    color: {
      start: '#865ec0',
      end: '#5144b4'
    },
    icon: 'fluent-color:star-24'
  },
  {
    key: 'diskSpace',
    title: $t('page.home.diskSpace'),
    value: totalFileSize.value,
    unit: ' TB',
    color: {
      start: '#fcbc25',
      end: '#f68057'
    },
    icon: 'fluent-color:cloud-24'
  }
])
interface GradientBgProps {
  gradientColor: string
}

const [DefineGradientBg, GradientBg] = createReusableTemplate<GradientBgProps>()

function getGradientColor(color: CardData['color']) {
  return `linear-gradient(to bottom right, ${color.start}, ${color.end})`
}
onMounted(() => {
  getTotalFileSize().then((res) => {
    if (res.data != null) {
      totalFileSize.value = res.data / 1000 / 1000 / 1000 / 1000
    }
  })

  getTotalVideoCount().then((res) => {
    if (res.data != null) {
      totalVideoCount.value = res.data
    }
  })
  getActressTotalCount().then((res) => {
    if (res.data != null) {
      totalActressCount.value = res.data
    }
  })

  getFavoriteMoviesCount().then((res) => {
    if (res.data != null) {
      totalFavoriteCount.value = res.data
    }
  })
})
const { routerPush } = useRouterPush()

function goPage(key: string) {
  if (key.startsWith('/')) {
    routerPush(key)
  }
}
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <!-- define component start: GradientBg -->
    <DefineGradientBg v-slot="{ $slots, gradientColor }">
      <div
        class="rd-8px px-16px pb-4px pt-8px text-white"
        :style="{ backgroundImage: gradientColor }">
        <component :is="$slots.default" />
      </div>
    </DefineGradientBg>
    <!-- define component end: GradientBg -->

    <NGrid cols="s:1 m:2 l:4" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi v-for="item in cardData" :key="item.key" @click="goPage(item.key)">
        <GradientBg :gradient-color="getGradientColor(item.color)" class="flex-1 cursor-pointer">
          <h3 class="text-16px">{{ item.title }}</h3>
          <div class="flex justify-between pt-12px">
            <SvgIcon :icon="item.icon" class="text-32px" />
            <CountTo
              :start-value="1"
              :end-value="item.value"
              :suffix="item.unit"
              class="text-30px text-white" />
          </div>
        </GradientBg>
      </NGi>
    </NGrid>
  </NCard>
</template>

<style scoped></style>

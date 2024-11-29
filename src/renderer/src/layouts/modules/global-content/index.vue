<script setup lang="ts">
import { useAppStore } from '@renderer/store/modules/app'
import { useRouteStore } from '@renderer/store/modules/route'
import { useTabStore } from '@renderer/store/modules/tab'
import { useThemeStore } from '@renderer/store/modules/theme'
import { computed } from 'vue'

defineOptions({
  name: 'GlobalContent'
})

interface Props {
  /** Show padding for content */
  showPadding?: boolean
}

withDefaults(defineProps<Props>(), {
  showPadding: true
})

const appStore = useAppStore()
const themeStore = useThemeStore()
const routeStore = useRouteStore()
const tabStore = useTabStore()

const transitionName = computed(() => (themeStore.page.animate ? themeStore.page.animateMode : ''))
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <Transition
      :name="transitionName"
      mode="out-in"
      @before-leave="appStore.setContentXScrollable(true)"
      @after-enter="appStore.setContentXScrollable(false)">
      <KeepAlive :include="routeStore.cacheRoutes">
        <component
          :is="Component"
          v-if="appStore.reloadFlag"
          :key="tabStore.getTabIdByRoute(route)"
          :class="{ 'p-16px': showPadding }"
          class="flex-grow bg-layout transition-300" />
      </KeepAlive>
    </Transition>
  </RouterView>
</template>

<style></style>

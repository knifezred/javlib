<script setup lang="ts">
import { useSvgIcon } from '@renderer/hooks/common/icon'
import { useRouterPush } from '@renderer/hooks/common/router'
import { $t } from '@renderer/locales'
import { useAuthStore } from '@renderer/store/modules/auth'
import type { VNode } from 'vue'
import { computed } from 'vue'

defineOptions({
  name: 'UserAvatar'
})

const authStore = useAuthStore()
const { routerPushByKey, toLogin } = useRouterPush()
const { SvgIconVNode } = useSvgIcon()

function loginOrRegister() {
  toLogin()
}

type DropdownKey = 'logout' | 'setting'

type DropdownOption = {
  key: DropdownKey
  label: string
  icon?: () => VNode
}

const options = computed(() => {
  const opts: DropdownOption[] = [
    {
      label: $t('route.setting'),
      key: 'setting',
      icon: SvgIconVNode({ icon: 'carbon:settings-adjust', fontSize: 18 })
    },
    {
      label: $t('common.logout'),
      key: 'logout',
      icon: SvgIconVNode({ icon: 'ph:sign-out', fontSize: 18 })
    }
  ]

  return opts
})

function logout() {
  window.$dialog?.info({
    title: $t('common.tip'),
    content: $t('common.logoutConfirm'),
    positiveText: $t('common.confirm'),
    negativeText: $t('common.cancel'),
    onPositiveClick: () => {
      authStore.resetStore()
    }
  })
}

function handleDropdown(key: DropdownKey) {
  if (key === 'logout') {
    logout()
  } else {
    routerPushByKey(key)
  }
}
</script>

<template>
  <NButton v-if="!authStore.isLogin" quaternary @click="loginOrRegister">
    {{ $t('page.login.common.loginOrRegister') }}
  </NButton>
  <NDropdown v-else placement="bottom" trigger="click" :options="options" @select="handleDropdown">
    <div>
      <ButtonIcon>
        <SvgIcon icon="ph:user-circle" class="text-icon-large" />
        <span class="text-16px font-medium">{{ authStore.userInfo.userName }}</span>
      </ButtonIcon>
    </div>
  </NDropdown>
</template>

<style scoped></style>

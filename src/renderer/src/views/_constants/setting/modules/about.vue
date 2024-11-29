<template>
  <NFlex vertical :size="16">
    <NCard
      :title="`${$t('page.about.title') + ' ' + $t('system.title')}`"
      :bordered="false"
      size="small"
      segmented
      class="card-wrapper">
      <p><icon-local-logo class="size-32" /> {{ $t('page.about.introduction') }}</p>
    </NCard>
    <NCard
      :title="$t('page.about.projectInfo.title')"
      :bordered="false"
      size="small"
      segmented
      class="card-wrapper">
      <NDescriptions label-placement="left" bordered size="small">
        <NDescriptionsItem :label="$t('page.about.projectInfo.version')">
          <NTag type="primary">{{ pkgJson.version }}</NTag>
          <NButton class="ml-2 w-24" size="small" type="primary" @click="checkVersion">
            {{ $t('page.about.update.checkUpdate') }}
            <icon-svg-spinners:180-ring-with-bg v-if="loading" class="ml-1" />
          </NButton>
        </NDescriptionsItem>
        <NDescriptionsItem :label="$t('page.about.projectInfo.latestBuildTime')">
          <NTag type="primary">{{ latestBuildTime }}</NTag>
        </NDescriptionsItem>
        <NDescriptionsItem :label="$t('page.about.projectInfo.author')">
          <NTag type="primary">{{ pkg.author }}</NTag>
        </NDescriptionsItem>
        <NDescriptionsItem :label="$t('page.about.projectInfo.githubLink')">
          <a class="text-primary" :href="pkg.homepage" target="_blank" rel="noopener noreferrer">
            {{ $t('page.about.projectInfo.githubLink') }}
          </a>
        </NDescriptionsItem>
        <NDescriptionsItem :label="$t('page.about.projectInfo.previewLink')">
          <a class="text-primary" :href="pkg.website" target="_blank" rel="noopener noreferrer">
            {{ $t('page.about.projectInfo.previewLink') }}
          </a>
        </NDescriptionsItem>
      </NDescriptions>
    </NCard>
    <n-modal v-model:show="showModal" preset="dialog" :title="$t('common.tip')">
      <n-flex vertical>
        <template v-if="updatePercentage == 0">
          <n-p class="ma-auto">
            <icon-local-aircraft class="size-32" />
          </n-p>
          <n-h3 prefix="bar" align-text type="info">
            {{ $t('page.about.update.newUpdateVersion') }}
          </n-h3>
        </template>
        <template v-if="updatePercentage > 0">
          <n-p class="ma-auto">
            <n-progress
              type="circle"
              :percentage="updatePercentage"
              indicator-placement="inside"
              :border-radius="4"
              :height="24" />
          </n-p>
          <n-h3 v-if="updateSuccess" prefix="bar" align-text type="info">
            {{ $t('page.about.update.rebootAndUpdate') }}
          </n-h3>
          <n-h3 v-else prefix="bar" align-text type="info">
            {{ $t('page.about.update.downloading') }}
            <icon-svg-spinners:180-ring-with-bg class="ml-1" />
          </n-h3>
        </template>
      </n-flex>
      <template #action>
        <n-button @click="showModal = false">
          {{ $t('common.cancel') }}
        </n-button>
        <n-button v-if="updateSuccess" type="primary" @click="rebootUpdate">
          {{ $t('page.about.update.reboot') }}
        </n-button>
        <n-button v-else type="primary" @click="submitCallback">
          {{ $t('common.confirm') }}
        </n-button>
      </template>
    </n-modal>
  </NFlex>
</template>

<script setup lang="ts">
import { $t } from '@renderer/locales'
import { onMounted, onUnmounted, ref } from 'vue'
import pkg from '../../../../../../../package.json'
const ipcRenderer = window.electron.ipcRenderer
const updatePercentage = ref(0)
const showModal = ref(false)
const updateSuccess = ref(false)
const loading = ref(false)
const { name, author, version } = pkg
interface PkgJson {
  name: string
  author: string
  version: string
}
const pkgJson: PkgJson = {
  name,
  author,
  version
}
const latestBuildTime = BUILD_TIME

function checkVersion() {
  loading.value = true
  ipcRenderer.send('check-for-update')
}

function submitCallback() {
  ipcRenderer.send('download-update')
}

function rebootUpdate() {
  ipcRenderer.send('quit-and-install')
}

onMounted(() => {
  ipcRenderer.on('check-for-update-reply', (_event, arg) => {
    loading.value = false
    if (arg == true) {
      showModal.value = true
    } else {
      window.$message?.info($t('page.about.update.noUpdateVersion'))
    }
  })
  ipcRenderer.on('download-update-percent-reply', (_event, arg) => {
    updatePercentage.value = parseFloat(arg.toFixed(2))
  })
  ipcRenderer.on('download-update-reply', (_event, arg) => {
    if (arg) {
      updatePercentage.value = 100
      updateSuccess.value = true
    }
  })
})
onUnmounted(() => {
  window.electron.ipcRenderer.removeAllListeners('check-for-update-reply')
  window.electron.ipcRenderer.removeAllListeners('download-update-percent-reply')
  window.electron.ipcRenderer.removeAllListeners('download-update-reply')
})
</script>

<style scoped></style>

<template>
  <NFlex>
    <NCard :bordered="false" class="w-full v-middle">
      <n-grid x-gap="12" y-gap="24" :cols="4">
        <n-gi></n-gi>
        <n-gi span="2">
          <n-form label-placement="left" label-width="220" label-align="left" size="large">
            <n-form-item :label="$t('page.setting.server_url')">
              <n-input v-model:value="appStore.projectSettings.serviceUrl" type="text" />
            </n-form-item>
            <n-form-item :label="$t('page.setting.media_folders')">
              <n-input
                v-model:value="media_folders"
                placeholder="一行一个，如有多个请回车换行"
                type="textarea"
                :autosize="{
                  minRows: 3,
                  maxRows: 5
                }" />
            </n-form-item>
            <n-form-item :label="$t('page.setting.tag_index')">
              <n-input
                v-model:value="tag_index"
                placeholder="一行一个，如有多个请回车换行"
                type="textarea"
                :autosize="{
                  minRows: 5,
                  maxRows: 10
                }" />
            </n-form-item>
            <n-form-item :label="$t('page.setting.actressMapping')">
              <n-input
                v-model:value="actress_mapping"
                placeholder="一行一个，如有多个请回车换行"
                type="textarea"
                :autosize="{
                  minRows: 5,
                  maxRows: 10
                }" />
            </n-form-item>
            <n-form-item :label="$t('page.setting.ext_player')">
              <n-input v-model:value="ext_player" type="text" />
            </n-form-item>
          </n-form>
          <n-button type="primary" class="w-xs" @click="saveMediaConfig">
            {{ $t('common.save') }}
          </n-button>
        </n-gi>
        <n-gi> </n-gi>
      </n-grid>
    </NCard>
  </NFlex>
</template>

<script setup lang="ts">
import { $t } from '@renderer/locales'
import { createStorage, findStorage, updateStorage } from '@renderer/service/api/storage'
import { useAppStore } from '@renderer/store/modules/app'
import { onMounted, ref } from 'vue'

const appStore = useAppStore()
const media_folders = ref('')
const tag_index = ref('')
const actress_mapping = ref('')
const ext_player = ref('')
function saveMediaConfig() {
  appStore.cacheProjectSettings()
  findStorage('media_folders').then((res) => {
    if (res.data && res.data.id) {
      res.data.value = media_folders.value
      updateStorage(res.data)
    } else {
      createStorage({
        key: 'media_folders',
        value: media_folders.value
      })
    }
  })
  findStorage('tag_index').then((res) => {
    if (res.data && res.data.id) {
      res.data.value = tag_index.value
      updateStorage(res.data)
    } else {
      createStorage({
        key: 'tag_index',
        value: tag_index.value
      })
    }
  })
  findStorage('actress_mapping').then((res) => {
    if (res.data && res.data.id) {
      res.data.value = actress_mapping.value
      updateStorage(res.data)
    } else {
      createStorage({
        key: 'actress_mapping',
        value: actress_mapping.value
      })
    }
  })
  findStorage('ext_player').then((res) => {
    if (res.data && res.data.id) {
      res.data.value = ext_player.value
      updateStorage(res.data)
    } else {
      createStorage({
        key: 'ext_player',
        value: ext_player.value
      })
    }
  })
  window.$message?.info($t('common.saveSuccess'))
}
onMounted(() => {
  findStorage('media_folders').then((res) => {
    if (res.data && res.data.id) {
      media_folders.value = res.data.value
    }
  })
  findStorage('tag_index').then((res) => {
    if (res.data && res.data.id) {
      tag_index.value = res.data.value
    }
  })
  findStorage('actress_mapping').then((res) => {
    if (res.data && res.data.id) {
      actress_mapping.value = res.data.value
    }
  })
  findStorage('ext_player').then((res) => {
    if (res.data && res.data.id) {
      ext_player.value = res.data.value
    }
  })
})
</script>

<style scoped></style>

<template>
  <NFlex>
    <NCard :bordered="false" class="w-full v-middle">
      <n-grid x-gap="12" y-gap="24" :cols="4">
        <n-gi></n-gi>
        <n-gi span="2">
          <n-h2>WebDAV</n-h2>
          <n-form label-placement="left" label-width="220" label-align="left" size="large">
            <n-form-item :label="$t('page.setting.webdav_server')">
              <n-input
                v-model:value="webdav_setting.server"
                type="text"
                placeholder="例：http://192.168.1.2:5005" />
            </n-form-item>
            <n-form-item :label="$t('page.setting.webdav_user')">
              <n-input v-model:value="webdav_setting.user" type="text" />
            </n-form-item>
            <n-form-item :label="$t('page.setting.webdav_password')">
              <n-input v-model:value="webdav_setting.password" type="password" />
            </n-form-item>
            <n-form-item :label="$t('page.setting.webdav_folders')" path="textareaValue">
              <n-input
                v-model:value="webdav_setting.folders"
                placeholder="一行一个，如有多个请回车换行"
                type="textarea"
                :autosize="{
                  minRows: 3,
                  maxRows: 5
                }" />
            </n-form-item>
          </n-form>
          <n-button type="primary" class="w-xs" @click="saveWebDav">{{
            $t('common.save')
          }}</n-button>
        </n-gi>
        <n-gi> </n-gi>
      </n-grid>
    </NCard>
  </NFlex>
</template>

<script setup lang="ts">
import { $t } from '@renderer/locales'
import { ref } from 'vue'
const webdav_setting = ref({
  server: '',
  user: '',
  password: '',
  folders: ''
})

function saveWebDav() {
  window.$message?.info($t('common.saveSuccess'))
}
</script>

<style scoped></style>

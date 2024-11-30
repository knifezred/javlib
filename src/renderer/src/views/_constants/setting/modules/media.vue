<template>
  <NFlex>
    <NCard :bordered="false" class="w-full v-middle">
      <n-grid x-gap="12" y-gap="24" :cols="4">
        <n-gi></n-gi>
        <n-gi span="2">
          <n-form label-placement="left" label-width="220" label-align="left" size="large">
            <n-form-item :label="$t('page.setting.media_folders')" path="textareaValue">
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
          <n-button type="primary" class="w-xs" @click="saveMediaConfig">{{
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

function saveMediaConfig() {
  window.$message?.info($t('common.saveSuccess'))
}
</script>

<style scoped></style>

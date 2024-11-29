<template>
  <NFlex>
    <NCard :bordered="false" class="w-full v-middle">
      <n-grid x-gap="12" y-gap="24" :cols="4">
        <n-gi></n-gi>
        <n-gi span="2">
          <n-form label-placement="left" label-width="220" label-align="left" size="large">
            <n-form-item :label="$t('setting.general.lang')" path="langValue">
              <n-select
                v-model:value="appStore.locale"
                :options="appStore.localeOptions"
                label-field="label"
                value-field="key"
                @update:value="appStore.changeLocale(appStore.locale)" />
            </n-form-item>
          </n-form>
        </n-gi>
        <n-gi> </n-gi>
      </n-grid>
    </NCard>
  </NFlex>
</template>

<script setup lang="ts">
import { useAppStore } from '@renderer/store/modules/app'
const appStore = useAppStore()
</script>

<style scoped></style>

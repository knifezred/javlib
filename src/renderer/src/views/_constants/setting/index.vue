<template>
  <n-flex class="pa-4" vertical>
    <n-tabs type="segment" animated>
      <n-tab-pane name="chap1" :tab="$t('route.setting_about')">
        <SettingAbout></SettingAbout>
      </n-tab-pane>
      <n-tab-pane name="chap2" :tab="$t('route.setting_system')">
        <SettingGeneral></SettingGeneral>
      </n-tab-pane>
      <n-tab-pane name="chap3" :tab="$t('route.setting_theme')">
        <SettingTheme></SettingTheme>
      </n-tab-pane>
    </n-tabs>
  </n-flex>
</template>
<script setup lang="ts">
import { $t } from '@renderer/locales'
import SettingAbout from './modules/about.vue'
import SettingGeneral from './modules/general.vue'
import SettingTheme from './modules/theme.vue'
</script>

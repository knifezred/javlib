<template>
  <n-grid x-gap="12" y-gap="24" :cols="2">
    <n-gi>
      <img :src="info.cover" class="h-sm ma-auto" />
    </n-gi>
    <n-gi>
      <NCard>
        <n-h3>
          <SvgIcon
            icon="fluent-emoji-flat:star"
            class="inline-block v-text-bottom size-6"></SvgIcon>
          {{ info.score + ' | ' + info.title }}
        </n-h3>
        <n-p depth="3">{{ info.originTitle }}</n-p>
        <n-p>{{ info.introduction }}</n-p>
        <n-p>添加时间：{{ new Date(info.createdTime).toLocaleDateString() }}</n-p>
        <n-p
          >个人评分：<n-rate
            :value="info.personalScore"
            allow-half
            @update-value="savePersonalScore"
        /></n-p>
        <n-p>上映时间：{{ info.releaseTime }}</n-p>
        <n-p>导演：{{ info.director }}</n-p>

        <n-h4>演员</n-h4>
        <NSpace>
          <n-tag
            v-for="actor in info.actress.substring(1, info.actress.length - 1).split('|')"
            :key="actor">
            {{ actor }}</n-tag
          >
        </NSpace>
      </NCard>
    </n-gi>
    <n-gi span="2">
      <NCard title="相关推荐"> </NCard>
    </n-gi>
    <n-gi>
      <NCard title="相关推荐"> </NCard>
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
defineOptions({
  name: 'ActressDetailDrawer'
})

interface Props {
  info: Dto.DbMovie
}

defineProps<Props>()

function savePersonalScore(value: number | undefined) {
  window.$message?.info(value + '')
  // props.info.personalScore = value
}
</script>

<style scoped></style>

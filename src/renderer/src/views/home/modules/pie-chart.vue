<script setup lang="ts">
import { useEcharts } from '@renderer/hooks/common/echarts';
import { fetchCategoryPagedList } from '@renderer/service/api/category';

defineOptions({
  name: 'PieChart'
})

const { domRef, updateOptions } = useEcharts(() => ({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '0',
    left: 'center',
    itemStyle: {
      borderWidth: 0
    }
  },
  series: [
    {
      color: [
        '#5da8ff',
        '#8e9dff',
        '#fedc69',
        '#26deca',
        '#e599f7',
        '#ff8787',
        '#95de64',
        '#20c997',
        '#5cdbd3',
        '#ffc078'
      ],
      type: 'pie',
      radius: ['45%', '75%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 0
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '12'
        }
      },
      labelLine: {
        show: false
      },
      data: [] as { name: string; value: number }[]
    }
  ]
}))

async function init() {
  fetchCategoryPagedList({
    type: 'tag',
    sortRule: 'DESC',
    sort: 'value',
    page: 1,
    pageSize: 7
  }).then((res) => {
    if (res.data != null) {
      updateOptions((opts) => {
        opts.series[0].data = []
        res.data.records.forEach((record) => {
          opts.series[0].data.push({ name: record.key, value: record.value })
        })
        return opts
      })
    }
  })
}

// watch(
//   () => appStore.locale,
//   () => {
//     updateLocale()
//   }
// )

// init
init()
</script>

<template>
  <NCard :bordered="false" title="热门标签" class="card-wrapper">
    <div ref="domRef" class="h-320px overflow-hidden"></div>
  </NCard>
</template>

<style scoped></style>

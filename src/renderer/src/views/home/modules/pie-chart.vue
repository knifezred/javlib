<script setup lang="ts">
import { useEcharts } from '@renderer/hooks/common/echarts'
import { fetchCategoryPagedList } from '@renderer/service/api/category'

defineOptions({
  name: 'PieChart'
})

const { domRef, updateOptions } = useEcharts(() => ({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    bottom: '1%',
    left: 'center',
    itemStyle: {
      borderWidth: 0
    }
  },
  series: [
    {
      color: ['#5da8ff', '#8e9dff', '#fedc69', '#26deca'],
      type: 'pie',
      radius: ['45%', '75%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 1
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
    pageSize: 10
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
  <NCard :bordered="false" class="card-wrapper">
    <div ref="domRef" class="h-360px overflow-hidden"></div>
  </NCard>
</template>

<style scoped></style>

<script setup lang="ts">
import { useEcharts } from '@renderer/hooks/common/echarts'
import { $t } from '@renderer/locales'
import { fetchActressPagedList } from '@renderer/service/api/actress'

defineOptions({
  name: 'ActressChart'
})

const { domRef, updateOptions } = useEcharts(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  legend: {
    data: [$t('page.home.movieCount')]
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: [] as string[]
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      color: '#8e9dff',
      name: $t('page.home.movieCount'),
      type: 'bar',
      data: [] as number[]
    }
  ]
}))

function getData() {
  fetchActressPagedList({
    page: 1,
    pageSize: 10,
    sort: 'videoCount',
    sortRule: 'DESC'
  }).then((res) => {
    if (res.data) {
      updateOptions((opts) => {
        opts.xAxis.data = []
        var xData = [] as number[]
        for (const record of res.data.records) {
          opts.xAxis.data.push(record.name)
          xData.push(record.videoCount)
        }
        opts.series[0].data = xData
        return opts
      })
    } else {
      updateOptions((opts) => {
        opts.xAxis.data = []
        opts.series[0].data = []
        return opts
      })
    }
  })
}

async function init() {
  getData()
}

// init
init()
</script>

<template>
  <NCard :bordered="false" class="card-wrapper">
    <div ref="domRef" class="h-360px overflow-hidden"></div>
  </NCard>
</template>

<style scoped></style>

<script setup lang="ts">
import { useEcharts } from '@renderer/hooks/common/echarts'
import { $t } from '@renderer/locales'
import { findRecentAddedMovies } from '@renderer/service/api/movie'

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
  findRecentAddedMovies(7).then(res => {
    if (res.data) {
      updateOptions((opts) => {
        opts.xAxis.data = []
        var xData = [] as number[]
        for (const record of res.data) {
          opts.xAxis.data.push(record.title)
          xData.push(record.fileSize)
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
  <NCard :bordered="false" title="近期入库" class="card-wrapper">
    <div ref="domRef" class="h-320px overflow-hidden"></div>
  </NCard>
</template>

<style scoped></style>

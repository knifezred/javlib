<template>
  <n-form label-placement="left" label-width="100">
    <n-grid x-gap="12" :cols="3">
      <n-gi :span="3">
        <n-h2>
          {{ $t('route.category_actress') }}
        </n-h2>
      </n-gi>
      <n-gi>
        <n-form-item label="姓名">
          <n-input v-model:value="actressInfo.name" type="text" />
        </n-form-item>
      </n-gi>
      <n-gi :span="2">
        <n-form-item label="别名">
          <n-input v-model:value="actressInfo.alias" type="text" />
        </n-form-item>
      </n-gi>
      <n-gi>
        <n-form-item label="出生日期">
          <n-date-picker value-format="yyyy-MM-dd" type="date" @update:value="updateBirthday" />
        </n-form-item>
      </n-gi>
    </n-grid>
    <n-form-item>
      <n-button attr-type="button" @click="submit"> {{ $t('common.save') }} </n-button>
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
import { createActress, updateActress } from '@renderer/service/api/actress'
import { onMounted, ref } from 'vue'

defineOptions({
  name: 'ActressDetailDrawer'
})

interface Emits {
  (e: 'close')
}

const emit = defineEmits<Emits>()
interface Props {
  info?: Dto.DbActress
}

const props = defineProps<Props>()
const actressInfo = ref<Dto.DbActress>({
  createdTime: 0,
  favorite: false,
  score: 0,
  personalScore: 0,
  uniqueid: '',
  name: '',
  alias: '',
  introduction: '',
  avatar: '',
  cover: '',
  tags: '',
  birthday: '',
  hasVideo: false
})

function submit() {
  if (actressInfo.value.id != undefined && actressInfo.value.id > 0) {
    updateActress(actressInfo.value)
  } else {
    createActress(actressInfo.value)
  }
  emit('close')
}
function updateBirthday(_val, formatVal: string) {
  actressInfo.value.birthday = formatVal
}
onMounted(() => {
  if (props.info != undefined) {
    actressInfo.value = props.info
  }
})
</script>

<style scoped></style>

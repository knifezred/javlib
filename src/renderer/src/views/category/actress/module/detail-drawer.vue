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
        <n-form-item label="头像">
          <n-upload
            action="#"
            :custom-request="customUpload"
            :file-list="uploadFileList"
            accept="image/*"
            list-type="image-card"
            :max="1"
            @remove="handleRemove" />
        </n-form-item>
      </n-gi>
      <n-gi :span="2">
        <n-form-item label="简介">
          <n-input v-model:value="actressInfo.introduction" type="textarea" />
        </n-form-item>
      </n-gi>
      <n-gi>
        <n-form-item label="出生日期">
          <n-date-picker v-model:value="actressInfo.birthday" type="date" />
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
import { UploadFileInfo } from 'naive-ui'
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
  birthday: 0,
  hasVideo: false,
  bust: 0,
  waist: 0,
  hip: 0
})

const uploadFileList = ref<UploadFileInfo[]>([])
async function customUpload({ file }) {
  actressInfo.value.avatar = await window.api.saveFile(file.file)
}
function handleRemove(data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) {
  uploadFileList.value = data.fileList.filter((x) => x.id != data.file.id)
}
function submit() {
  if (actressInfo.value.id != undefined && actressInfo.value.id > 0) {
    updateActress(actressInfo.value)
  } else {
    createActress(actressInfo.value)
  }
  emit('close')
}

onMounted(() => {
  if (props.info != undefined) {
    actressInfo.value = props.info
    uploadFileList.value = [
      {
        url: actressInfo.value.avatar,
        id: '1',
        name: 'avatar.jpg',
        status: 'finished'
      }
    ]
  }
})
</script>

<style scoped></style>

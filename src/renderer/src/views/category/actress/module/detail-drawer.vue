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
          <n-input v-model:value="actress.name" type="text" />
        </n-form-item>
      </n-gi>
      <n-gi :span="2">
        <n-form-item label="别名">
          <n-input v-model:value="actress.alias" type="text" />
        </n-form-item>
      </n-gi>

      <n-gi>
        <n-form-item label="头像">
          <n-upload
            action="#"
            :file-list="uploadFileList"
            accept="image/*"
            list-type="image-card"
            :max="1"
            @change="handleChange" />
        </n-form-item>
      </n-gi>
      <n-gi :span="2">
        <n-form-item label="简介">
          <n-input v-model:value="actress.introduction" type="textarea" />
        </n-form-item>
      </n-gi>
      <n-gi>
        <n-form-item label="出生日期">
          <n-date-picker type="date" class="w-32" @change="updateBirthday" />
          <n-text class="pl-2">{{ actress.birthday }}</n-text>
        </n-form-item>
      </n-gi>
      <n-gi :span="2">
        <n-space>
          <n-form-item label="B">
            <n-input-number v-model:value="actress.bust" class="w-30" />
          </n-form-item>
          <n-form-item label="W">
            <n-input-number v-model:value="actress.waist" class="w-30" />
          </n-form-item>
          <n-form-item label="H">
            <n-input-number v-model:value="actress.hip" class="w-30" />
          </n-form-item>
        </n-space>
      </n-gi>
      <n-gi :span="3">
        <n-form-item label="标签">
          <n-dynamic-tags v-model:value="actressTags" />
        </n-form-item>
      </n-gi>
    </n-grid>
    <n-form-item>
      <n-button attr-type="button" @click="submit"> {{ $t('common.save') }} </n-button>
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
import { $t } from '@renderer/locales'
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
const actress = ref<Dto.DbActress>({
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
  hasVideo: false,
  bust: 0,
  waist: 0,
  hip: 0
})

const actressTags = ref<Array<string>>([])
const uploadFileList = ref<UploadFileInfo[]>([])

async function handleChange(data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) {
  if (data.file.file) {
    actress.value.avatar = await window.api.saveFile(data.file.file)
    uploadFileList.value.push(data.file)
  } else {
    uploadFileList.value = data.fileList.filter((x) => x.id != data.file.id)
  }
}

function submit() {
  actress.value.tags = '|' + actressTags.value.join('|') + '|'
  if (actress.value.id != undefined && actress.value.id > 0) {
    updateActress(actress.value).then(() => {
      window.$message?.success($t('common.updateSuccess'))
    })
  } else {
    createActress(actress.value).then(() => {
      window.$message?.success($t('common.addSuccess'))
    })
  }
  emit('close')
}
function updateBirthday(val: number) {
  actress.value.birthday = new Date(val).toLocaleDateString()
}
onMounted(() => {
  if (props.info != undefined) {
    actress.value = props.info
    uploadFileList.value = [
      {
        url: actress.value.avatar,
        id: '1',
        name: 'avatar.jpg',
        status: 'finished'
      }
    ]
    actressTags.value = actress.value.tags.split('|').filter((x) => x.length > 0)
  }
})
</script>

<style scoped></style>

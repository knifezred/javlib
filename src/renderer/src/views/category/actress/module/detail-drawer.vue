<template>
  <n-form label-placement="left" label-width="100">
    <n-grid x-gap="12" :cols="3">
      <n-gi :span="3">
        <n-h2>
          {{ $t('route.category_actress') }}
        </n-h2>
      </n-gi>
      <n-gi>
        <n-form-item :label="$t('page.actress.name')">
          <n-input v-model:value="actress.name" type="text" />
        </n-form-item>
      </n-gi>
      <n-gi :span="2">
        <n-form-item :label="$t('page.actress.alias')">
          <n-input v-model:value="actress.alias" type="text" />
        </n-form-item>
      </n-gi>
      <n-gi>
        <n-form-item :label="$t('page.actress.avatar')">
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
        <n-form-item :label="$t('page.actress.introduction')">
          <n-input v-model:value="actress.introduction" type="textarea" />
        </n-form-item>
      </n-gi>
      <n-gi>
        <n-form-item :label="$t('page.actress.birthday')">
          <n-input v-model:value="actress.birthday" type="text" class="w-32" />
        </n-form-item>
      </n-gi>
      <n-gi :span="2">
        <n-space>
          <n-form-item label="胸围/B">
            <n-input-number
              v-model:value="actress.bust"
              class="w-30"
              @change="autoScore"></n-input-number>
          </n-form-item>
          <n-form-item label="腰围/W">
            <n-input-number v-model:value="actress.waist" class="w-30" @change="autoScore" />
          </n-form-item>
          <n-form-item label="臀围/H">
            <n-input-number v-model:value="actress.hip" class="w-30" @change="autoScore" />
          </n-form-item>
        </n-space>
      </n-gi>
      <n-gi>
        <n-form-item :label="$t('page.actress.debutDate')">
          <n-input v-model:value="actress.debutDate" type="text" class="w-32" />
        </n-form-item>
      </n-gi>
      <n-gi :span="2">
        <n-space>
          <n-form-item :label="$t('page.actress.face')">
            <n-input-number
              v-model:value="actress.face"
              :max="10"
              :min="0"
              class="w-30"
              @update:value="autoScore" />
          </n-form-item>
          <n-form-item :label="$t('page.actress.body')">
            <n-input-number
              v-model:value="actress.body"
              :max="10"
              :min="0"
              class="w-30"
              @update:value="autoScore" />
          </n-form-item>
          <n-form-item :label="$t('page.actress.bodyHeight') + '(cm)'">
            <n-input-number v-model:value="actress.bodyHeight" class="w-30" @change="autoScore" />
          </n-form-item>
        </n-space>
      </n-gi>
      <n-gi>
        <n-form-item :label="$t('page.actress.bodySize')">
          <n-radio-group v-model:value="actress.bodySize" @change="autoScore">
            <n-radio-button
              v-for="item in bodySizeOptions"
              :key="item.value"
              :value="item.value"
              :label="item.label" />
          </n-radio-group>
        </n-form-item>
      </n-gi>
      <n-gi :span="2">
        <n-form-item :label="$t('page.actress.cup')">
          <n-radio-group v-model:value="actress.cup" @change="autoScore">
            <n-radio
              v-for="option in cupOptions"
              :key="option.label"
              :value="option.value"
              :label="option.label" />
          </n-radio-group>
        </n-form-item>
      </n-gi>
      <n-gi>
        <n-form-item label="综合评分">
          <n-rate allow-half v-model:value="actress.score" readonly :count="10" />
        </n-form-item>
      </n-gi>
      <n-gi>
        <n-form-item label="个人评分">
          <n-rate allow-half v-model:value="actress.personalScore" />
        </n-form-item>
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
import { bodySizeOptions, cupOptions } from '@renderer/constants/library'
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
  category: '',
  name: '',
  alias: '',
  introduction: '',
  avatar: '',
  cover: '',
  tags: '',
  birthday: '',
  videoCount: 0,
  bust: 0,
  waist: 0,
  hip: 0,
  face: 0,
  body: 0,
  cup: 0,
  bodySize: '',
  bodyHeight: 0,
  debutDate: ''
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

function autoScore() {
  console.log(actress.value.score)
  // face body cup bodyHeight  b w h birthday
  // 3 2 2 1 1 1
  // 7分
  let score = actress.value.face * 0.3 + actress.value.body * 0.1
  // 年龄 1分
  const year = parseInt(actress.value.birthday.split('/')[0])
  const currentYear = new Date().getFullYear()
  if (currentYear - year <= 24) {
    score += 1
  } else if (currentYear - year > 24) {
    score += score + 1 - (currentYear - year - 24) * 0.1
  }
  // bwh 1分
  //
  // cup 0.6分
  if (actress.value.cup < 3) {
    score += actress.value.cup * 0.05
  } else if (actress.value.cup >= 3 && actress.value.cup < 7) {
    score += actress.value.cup * 0.1
  } else {
    score += (cupOptions.length - actress.value.cup) * 0.08
  }
  if (actress.value.bodyHeight < 155) {
    // 身高 0.5分
    score += 0.1
  } else if (actress.value.bodyHeight >= 155 && actress.value.bodyHeight < 160) {
    score += 0.2
  } else if (actress.value.bodyHeight >= 160 && actress.value.bodyHeight < 166) {
    score += 0.4
  } else if (actress.value.bodyHeight >= 165 && actress.value.bodyHeight < 170) {
    score += 0.5
  } else if (actress.value.bodyHeight >= 170 && actress.value.bodyHeight < 175) {
    score += 0.5
  } else {
    score += 0.4
  }
  actress.value.score = parseFloat(score.toFixed(2))
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

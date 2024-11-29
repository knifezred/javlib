<script setup lang="ts">
import { useCaptcha } from '@renderer/hooks/business/captcha'
import { useFormRules, useNaiveForm } from '@renderer/hooks/common/form'
import { useRouterPush } from '@renderer/hooks/common/router'
import { $t } from '@renderer/locales'
import { computed, reactive } from 'vue'

defineOptions({
  name: 'CodeLogin'
})

const { toggleLoginModule } = useRouterPush()
const { formRef, validate } = useNaiveForm()
const { label, isCounting, loading, getCaptcha } = useCaptcha()

interface FormModel {
  phone: string
  code: string
  password: string
  confirmPassword: string
}

const model: FormModel = reactive({
  phone: '',
  code: '',
  password: '',
  confirmPassword: ''
})

const rules = computed<Record<keyof FormModel, App.Global.FormRule[]>>(() => {
  const { formRules, createConfirmPwdRule } = useFormRules()

  return {
    phone: formRules.phone,
    code: formRules.code,
    password: formRules.pwd,
    confirmPassword: createConfirmPwdRule(model.password)
  }
})

async function handleSubmit() {
  await validate()
  // request to register
  window.$message?.success($t('page.login.common.validateSuccess'))
}
</script>

<template>
  <NForm ref="formRef" :model="model" :rules="rules" size="large" :show-label="false">
    <NFormItem path="phone">
      <NInput v-model:value="model.phone" :placeholder="$t('page.login.common.phonePlaceholder')" />
    </NFormItem>
    <NFormItem path="code">
      <div class="w-full flex-y-center gap-16px">
        <NInput v-model:value="model.code" :placeholder="$t('page.login.common.codePlaceholder')" />
        <NButton
          size="large"
          :disabled="isCounting"
          :loading="loading"
          @click="getCaptcha(model.phone)">
          {{ label }}
        </NButton>
      </div>
    </NFormItem>
    <NFormItem path="password">
      <NInput
        v-model:value="model.password"
        type="password"
        show-password-on="click"
        :placeholder="$t('page.login.common.passwordPlaceholder')" />
    </NFormItem>
    <NFormItem path="confirmPassword">
      <NInput
        v-model:value="model.confirmPassword"
        type="password"
        show-password-on="click"
        :placeholder="$t('page.login.common.confirmPasswordPlaceholder')" />
    </NFormItem>
    <NSpace vertical :size="18" class="w-full">
      <NButton type="primary" size="large" round block @click="handleSubmit">
        {{ $t('common.confirm') }}
      </NButton>
      <NButton size="large" round block @click="toggleLoginModule('pwd-login')">
        {{ $t('page.login.common.back') }}
      </NButton>
    </NSpace>
  </NForm>
</template>

<style scoped></style>

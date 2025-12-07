<script setup lang="ts">
import { apiClient } from '@/api/api'
import BaseInputGroup from '@/components/common/BaseInputGroup.vue'
import FormContainer from '@/components/container/FormContainer.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import { useApi } from '@/composables/useApi'
import type {  LoginDTO, LoginResponse } from '@/lib/types/auth/login.type'
import {
  loginValidationSchema,
  type LoginFormData,
} from '@/schema/validation/login-validation.schema'
import { AUTH_UTILS } from '@/utils/auth'
import { validateForm } from '@/utils/parse-validation'
import { Icon } from '@iconify/vue'
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'

const loginFormData = reactive<LoginFormData>({ email: '', password: '' })
const errors = reactive<LoginFormData>({
  email: '',
  password: '',
})

const router = useRouter()

const {
  isError,
  isIdle,
  isLoading,
  isSuccess,
  error,
  data,
  execute: executeLogin,
} = useApi<{data: LoginResponse}>({
  dataFn: (config) =>
    apiClient.post<{data: LoginResponse}>({ endpoint: '/auth/login', ...config }),
})

const user = computed(() => data.value)

const buttonDisabled = computed(
  () =>
    loginFormData.email.trim() === '' || loginFormData.password.trim() === '' || isLoading.value,
)

async function handleSubmit(e: SubmitEvent) {
  e.preventDefault()
  const isValidated = validateForm<LoginFormData>(
    { email: loginFormData.email, password: loginFormData.password },
    errors,
    loginValidationSchema,
  )

  if (!isValidated) return

  const _payload: LoginDTO = {
    email: loginFormData.email,
    password: loginFormData.password,
  }

  await executeLogin({ data: _payload })
  if (isSuccess && data.value) {
    AUTH_UTILS.setToken(user.value?.data.token as string)
    router.push('/protected/home')
  }
}
</script>

<template>
  <FormContainer
    :submit="handleSubmit"
    title="Login"
    description="Login to listen in the spotify clone"
  >
    <div class="space-y-4">
      <BaseInputGroup label="Email" for="email">
        <Input
          id="email"
          :modal-value="loginFormData.email"
          @update="
            ($event) => {
              loginFormData.email = $event as string
              if (errors.email.trim() !== '') errors.email = ''
            }
          "
        />
        <p class="text-red-500 text-sm" v-if="errors.email">
          {{ errors.email }}
        </p>
      </BaseInputGroup>
      <BaseInputGroup label="Password" for="password">
        <Input
          id="password"
          type="password"
          autocomplete="off"
          :modal-value="loginFormData.password"
          @update="
            ($event) => {
              loginFormData.password = $event as string
              if (errors.password.trim() !== '') errors.password = ''
            }
          "
        />
        <p class="text-red-500 text-sm" v-if="errors.password">
          {{ errors.password }}
        </p>
      </BaseInputGroup>
    </div>
    <template #footer>
      <Button :disabled="buttonDisabled" class="w-full" type="submit">
        <p v-if="isIdle">Login</p>
        <p v-if="isLoading"><Icon icon="eos-icons:loading" class="h-5 w-5 text-white" /> </p>
        <p v-if="isSuccess">Welcome!</p>
        <p v-if="isError && error">{{ error }}</p>
      </Button>
    </template>
  </FormContainer>
</template>

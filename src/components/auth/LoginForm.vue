<script setup lang="ts">
import { apiClient } from '@/api/api'
import BaseInputGroup from '@/components/common/BaseInputGroup.vue'
import FormContainer from '@/components/container/FormContainer.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import { useApi } from '@/composables/useApi'
import { VUE_CONFIG } from '@/config/config'
import type { LoginDTO, LoginResponse } from '@/lib/types/auth/login.type'
import {
  loginValidationSchema,
  type LoginFormData,
} from '@/schema/validation/login-validation.schema'
import { computed, reactive } from 'vue'

const loginFormData = reactive<LoginFormData>({ email: '', password: '' })
const errors = reactive({
  email: '',
  password: '',
})

const { IDLE, LOADING, SUCCESS, ERROR, error, data, execute } = useApi<LoginResponse>()

const buttonDisabled = computed(
  () =>
    loginFormData.email.trim() === '' ||
    loginFormData.password.trim() === '' ||
    LOADING.value !== null,
)

function validateLoginForm(): boolean {
  const result = loginValidationSchema.safeParse({
    email: loginFormData.email,
    password: loginFormData.password,
  })

  if (!result.success) {
    result.error.errors.forEach((err) => {
      errors[err.path[0] as 'email' | 'password'] = err.message
    })
    return false
  } else {
    return true
  }
}

async function handleSubmit(e: SubmitEvent) {
  e.preventDefault()
  console.log(VUE_CONFIG.BASE_URL, 'BASE URL')
  const isValidated = validateLoginForm()

  if (!isValidated) return

  const _payload: LoginDTO = {
    email: loginFormData.email,
    password: loginFormData.password,
  }

  await execute(apiClient.post<LoginResponse>({ endpoint: '/auth/login', data: _payload }))
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
          :modal-value="loginFormData.password"
          @update="
            ($event) => {
              loginFormData.password = $event as string
              if (errors.password.trim() !== '') errors.password = ''
            }
          "
          @blur="validateLoginForm"
        />
        <p class="text-red-500 text-sm" v-if="errors.password">
          {{ errors.password }}
        </p>
      </BaseInputGroup>
    </div>
    <template #footer>
      <Button :disabled="buttonDisabled" class="w-full" type="submit">
        <p v-if="IDLE">Login</p>
        <p v-if="LOADING">Loading...</p>
        <p v-if="SUCCESS">Welcome!</p>
        <p v-if="ERROR && error">{{ error }}</p>
      </Button>
    </template>
  </FormContainer>
</template>

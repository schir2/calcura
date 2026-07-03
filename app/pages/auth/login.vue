<template>
  <n-form v-if="!isAuthenticated" ref="formRef" :model="credentialsRef" :rules="rules">
    <n-form-item path="email" label="Email">
      <n-input ref="emailRef" placeholder="email" v-model:value="credentialsRef.email"></n-input>
    </n-form-item>
    <n-form-item path="password" label="Password">
      <n-input type="password" placeholder="Password" v-model:value="credentialsRef.password"></n-input>
    </n-form-item>
    <n-form-item>
      <div class="grid grid-cols-2 w-full gap-2">
        <n-button type="primary" attr-type="submit" @click="handleLogin" :loading="isLoginLoading">Login</n-button>
        <n-button @click="$router.push('/auth/register/')">Register</n-button>
      </div>
    </n-form-item>
    <n-form-item>
      <n-button class="w-full" @click="handleGoogleLogin" :loading="isGoogleLoading">
        <template #icon>
          <Icon name="mdi:google" />
        </template>
        Sign in with Google
      </n-button>
    </n-form-item>
    <n-button quaternary type="primary">Forgot Password?</n-button>
  </n-form>
  <n-button v-if="isAuthenticated" @click="auth.logout()" :loading="isLogoutLoading">Log Out</n-button>
</template>
<script lang="ts" setup>

import type {FormInst, FormRules} from "naive-ui"

definePageMeta({
  layout: 'auth',
  title: 'Login',
})

const router = useRouter()
const auth = useAuth()
const {isAuthenticated} = auth

const message = useMessage()
const loadingBar = useLoadingBar()
const isLoginLoading = ref<boolean>(false)
const isLogoutLoading = ref<boolean>(false)
const isGoogleLoading = ref<boolean>(false)

type Credentials = {
  email: string
  password: string
}

const formRef = ref<FormInst | null>(null)
const credentialsRef = ref<Credentials>({
  email: '',
  password: ''
})

const rules: FormRules = {
  email: [
    {required: true, message: 'Email is required', trigger: ['blur', 'change']},
    {min: 5, max: 254, message: 'Email must be at least 5 characters', trigger: ['blur', 'change']},
  ],
  password: [
    {required: true, message: 'Password is required', trigger: ['blur', 'change']},
    {min: 8, max: 128, message: 'Password must be at least 8 characters', trigger: ['blur', 'change']},
  ]
}

async function handleLogin() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      isLoginLoading.value = true;
      loadingBar.start()
      try {
        await auth.login(credentialsRef.value.email, credentialsRef.value.password)
        message.success('Login Successful')
        loadingBar.finish()
        await router.push('/dashboard')
      } catch (error: any) {
        message.error(error?.message ?? 'Login failed')
        loadingBar.error()
      } finally {
        isLoginLoading.value = false;
      }
    }
  })
}

async function handleGoogleLogin() {
  isGoogleLoading.value = true
  try {
    await auth.loginWithGoogle()
  } catch (error: any) {
    message.error(error?.message ?? 'Google login failed')
  } finally {
    isGoogleLoading.value = false
  }
}

const emailRef = ref<null | HTMLElement>(null)

onMounted(() => {
  if (emailRef.value) {
    emailRef.value.focus()
  }
})
</script>

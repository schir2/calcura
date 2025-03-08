<template>
  <n-form v-if="!user" ref="formRef" :model="credentialsRef" :rules="rules">
    <n-form-item path="email" label="Email">
      <n-input ref="emailRef"  placeholder="email" v-model:value="credentialsRef.email"></n-input>
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
    <n-button quaternary type="primary" y>Forgot Password?</n-button>
  </n-form>
  <n-button v-if="authStore.user" @click="authStore.logout()" :loading="isLogoutLoading">Log Out</n-button>
</template>
<script lang="ts" setup>

import type {FormInst, FormRules} from "naive-ui"

definePageMeta({
  layout: 'auth',
  title: 'Login',
})

const router = useRouter()
const authStore = useAuthStore()

const {user} = storeToRefs(authStore)

const message = useMessage()
const loadingBar = useLoading()
const isLoginLoading = ref<boolean>(false)
const isLogoutLoading = ref<boolean>(false)


interface Credentials {
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
    {min: 5, max: 32, message: 'Password must be at least 8 characters', trigger: ['blur', 'change']},
  ],
  password: [
    {required: true, message: 'Password is required', trigger: ['blur', 'change']},
    {min: 5, max: 32, message: 'Password must be at least 8 characters', trigger: ['blur', 'change']},

  ]
}

async function handleLogin() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      isLoginLoading.value = true;
      loadingBar.start()
      try {
        await authStore.login(credentialsRef.value)
        message.success('Login Successful')
        await router.push('/')
      } catch (error) {
        if (error.response) {
          message.error(error.response._data.error)
          loadingBar.error()
        }
      }
      isLoginLoading.value = false;
      loadingBar.finish()
    }
  })
}

const emailRef = ref<null | HTMLElement>(null)

onMounted(() => {
  if (emailRef.value) {
    emailRef.value.focus()
  }
})


</script>
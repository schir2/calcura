<template>
  <n-form v-if="!authStore.user" ref="formRef" :model="credentialsRef" :rules="rules">
    <n-form-item path="username" label="Username">
      <n-input placeholder="Username" v-model:value="credentialsRef.username"></n-input>
    </n-form-item>
    <n-form-item path="password" label="Password">
      <n-input type="password" placeholder="Password"  v-model:value="credentialsRef.password"></n-input>
    </n-form-item>
    <n-button attr-type="submit" @click="handleLogin(formRef)" :loading="isLoginLoading">Login</n-button>
  </n-form>
  <n-button v-if="authStore.user" @click="authStore.logout()" :loading="isLogoutLoading">Log Out</n-button>
</template>
<script lang="ts" setup>

import type {FormInst, FormRules} from "naive-ui"

const router = useRouter()
const authStore = useAuthStore()
const message = useMessage()
const loadingBar = useLoading()
const isLoginLoading = ref<boolean>(false)
const isLogoutLoading = ref<boolean>(false)


interface Credentials {
  username: string
  password: string
}

const formRef = ref<FormInst | null>(null)
const credentialsRef = ref<Credentials>({
  username: '',
  password: ''
})

const rules: FormRules = {
  username: [
    {required: true, message: 'Username is required', trigger: ['blur', 'change']},
    {min: 5, max: 32, message: 'Password must be at least 8 characters', trigger: ['blur', 'change']},
  ],
  password: [
    {required: true, message: 'Password is required', trigger: ['blur', 'change']},
    {min: 5, max: 32, message: 'Password must be at least 8 characters', trigger: ['blur', 'change']},

  ]
}

async function getUserProfile() {
  const data = await $fetch('/api/users/me/')
}


async function handleLogin() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      isLoginLoading.value = true;
      loadingBar.start()
      try {
        await authStore.login(credentialsRef.value)
        message.success('Login Successful')
      } catch (error) {
        if (error.response) {
          message.error(error.response._data.error)
          loadingBar.error()
        }
      }
      isLoginLoading.value = false;
      loadingBar.finish()
      await router.push('/')
    }
  })
}


</script>
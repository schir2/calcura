<template>
  <n-form v-if="!user" ref="formRef" :model="credentialsRef" :rules="rules">
    <n-form-item path="username" label="Username">
      <n-input placeholder="Username" v-model:value="credentialsRef.username"></n-input>
    </n-form-item>
    <n-form-item path="password" label="Password">
      <n-input type="password" placeholder="Password"  v-model:value="credentialsRef.password"></n-input>
    </n-form-item>
    <n-button attr-type="submit" @click="handleLogin(formRef)" :loading="isLoginLoading">Login</n-button>
  </n-form>
  <n-button v-if="user" @click="logout()" :loading="isLogoutLoading">Log Out</n-button>
</template>
<script lang="ts" setup>

import type {FormInst, FormRules} from "naive-ui"

const {user, login, logout} = useAuth()

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

const message = useMessage()
const isLoginLoading = ref<boolean>(false)
const isLogoutLoading = ref<boolean>(false)

async function getUserProfile() {
  const data = await $fetch('/api/users/me/')
  console.log(data)
}


async function handleLogin() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      isLoginLoading.value = true;
      try {
        await login(credentialsRef.value)
        message.success('Login Successful')
      } catch (error) {
        console.log(error)
        if (error.response) {

          console.log("HTTP Status Code:", error.response.status);
          console.log("Response Data:", error.response._data);
          message.error(error.response._data.error)
        }
      }
      isLoginLoading.value = false;
    }
  })
}


</script>
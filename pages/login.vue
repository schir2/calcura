<template>
  <n-form ref="formRef" :model="credentialsRef" :rules="rules">
    <n-form-item path="username" label="Username">
      <n-input placeholder="Username" v-model:value="credentialsRef.username"></n-input>
    </n-form-item>
    <n-form-item path="password" label="Password">
      <n-input type="password" placeholder="Password" v-model:value="credentialsRef.password"></n-input>
    </n-form-item>
    <n-button @click="handleLogin(formRef)">Login</n-button>
  </n-form>
  <n-button @click="getUserProfile()">Get User Profile </n-button>
</template>
<script lang="ts" setup>

import type {FormInst, FormRules} from "naive-ui"
import type {User} from "~/types/User";

interface Credentials {
  username: string
  password: string
}

const formRef = ref<FormInst>()
const credentialsRef = ref<Credentials>({
  username: '',
  password: ''
})
const rules = ref<FormRules>({
  username: [
    {required: true, message: 'Username is required', trigger: ['blur', 'change']},
    {min: 5, max: 32, message: 'Password must be at least 8 characters', trigger: ['blur', 'change']},
  ],
  password: [
    {required: true, message: 'Password is required', trigger: ['blur', 'change']},
    {min: 5, max: 32, message: 'Password must be at least 8 characters', trigger: ['blur', 'change']},

  ]
})

const user = ref<User>()

async function getUserProfile() {
  const {data, status, error, refresh} = await useFetch('http://localhost:8000/api/users', {credentials: 'include'})
  console.log(data)
}

async function login(credentials: Credentials) {
  return await useFetch('http://localhost:8000/api/token/', {
    method: 'POST',
    body: credentialsRef.value,
    credentials: 'include',
  })
}

async function handleLogin(formInst: FormInst) {
  formInst.value.validate(async (valid, errors) => {
    if (valid) {
      const {data, status, error, refresh} = await login()
      console.log(data)
    }

  })
}


</script>
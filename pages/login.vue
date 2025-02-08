<template>
  <n-form ref="formRef" :model="credentialsRef" :rules="rules">
    <n-form-item path="username" label="Username">
      <n-input placeholder="Username" v-model:value="credentialsRef.username"></n-input>
    </n-form-item>
    <n-form-item path="password" label="Password">
      <n-input type="password" placeholder="Password" v-model:value="credentialsRef.password"></n-input>
    </n-form-item>
    <n-button @click="handleLogin(formRef)" :loading="isLoginLoading">Login</n-button>
  </n-form>
  <n-button @click="getUserProfile()">Get User Profile</n-button>
  <n-button @click="logout()">Log Out</n-button>
  <n-button @click="getPlans()">Get Plans</n-button>
</template>
<script lang="ts" setup>

import type {FormInst, FormRules} from "naive-ui"
import type {User} from "~/types/User";

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
const user = ref<User>()

async function getUserProfile() {
  const {data, status, error, refresh} = await useFetch('http://localhost:8000/api/users/me/', {credentials: 'include'})
  console.log(data.value)
}

async function getCsrfToken() {
  const {data} = await useFetch("http://localhost:8000/api/auth/csrf/", {
    credentials: "include",
  });
  return data.value?.csrfToken;
}

async function login(credentials: Credentials) {
  const csrfToken = await getCsrfToken()
  return useFetch('http://localhost:8000/api/auth/login/', {
    method: 'POST',
    body: credentials,
    credentials: 'include',
    headers: {'X-CSRFToken': csrfToken}
  })
}

async function logout() {
  const csrfToken = await getCsrfToken();

  const {data, error} = await useFetch("http://localhost:8000/api/auth/logout/", {
    method: "POST",
    credentials: "include",
    headers: {
      "X-CSRFToken": csrfToken,
    },
  });
}

async function handleLogin() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      isLoginLoading.value = true;
      const {data, error} = await login(credentialsRef.value)
      isLoginLoading.value = false;
      if (error.value) {
        message.error(error.value.message)
      } else {
        message.success('Login Successful')

        message.info(JSON.stringify(data.value));
      }
    } else {
      console.log(errors)
    }

  })
}

async function getPlans() {
  const { data, error } = await useFetch("http://localhost:8000/api/plans/", {
    credentials: "include",
  });

  if (error.value) {
    console.error("Error fetching plans:", error.value);
  } else {
    console.log("Plans:", data.value.plans);
    console.log("User:", data.value.user); // The authenticated user
  }
}



</script>
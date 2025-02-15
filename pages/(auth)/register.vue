<template>
  <client-only>
    <n-form v-if="!authStore.user" ref="formRef" :model="credentialsRef" :rules="rules">
      <n-form-item path="username" label="Username">
        <n-input placeholder="Username" v-model:value="credentialsRef.username"></n-input>
      </n-form-item>
      <n-form-item path="password" label="Password">
        <n-input type="password" placeholder="Password" v-model:value="credentialsRef.password"></n-input>
      </n-form-item>
      <n-button attr-type="submit" @click="handleRegister(formRef)" :loading="isRegisterLoading">Register</n-button>
    </n-form>
    <n-button v-if="authStore.user" @click="authStore.logout()" :loading="isLogoutLoading">Log Out</n-button>
  </client-only>
</template>
<script lang="ts" setup>

import type {FormInst, FormRules} from "naive-ui"

const router = useRouter()
const authStore = useAuthStore()
const message = useMessage()
const loadingBar = useLoading()
const isRegisterLoading = ref<boolean>(false)
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

async function handleRegister() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      isRegisterLoading.value = true;
      loadingBar.start()
      try {
        const response = await authStore.register(credentialsRef.value)
        if (response.status === 200) {

        }
        message.success('Registration Successful')
        await router.push('/')
      } catch (error) {
        if (error.response) {
          message.error(error.response._data.error)
          loadingBar.error()
        }
      }
      isRegisterLoading.value = false;
      loadingBar.finish()
    }
  })
}


</script>
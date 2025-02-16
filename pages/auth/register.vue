<template>
  <client-only>
    <n-form v-if="!authStore.user" ref="registrationForm" :model="registration" :rules="rules">
      <n-form-item path="username" label="Username">
        <n-input placeholder="Username" v-model:value="registration.username"></n-input>
      </n-form-item>
      <n-form-item path="password" label="Password">
        <n-input type="password" placeholder="Password" v-model:value="registration.password"></n-input>
      </n-form-item>
      <n-form-item path="passwordConfirmation" label="Password Confirmation">
        <n-input type="password" placeholder="Password Confirmation" v-model:value="registration.passwordConfirmation"></n-input>
      </n-form-item>
      <n-button attr-type="submit" @click="handleRegister(registrationForm)" :loading="isRegisterLoading">Register</n-button>
    </n-form>
    <n-button v-if="authStore.user" @click="authStore.logout()" :loading="isLogoutLoading">Log Out</n-button>
  </client-only>
</template>
<script lang="ts" setup>

import type {FormInst, FormItemRule, FormRules} from "naive-ui"

const router = useRouter()
const authStore = useAuthStore()
const message = useMessage()
const loadingBar = useLoading()
const isRegisterLoading = ref<boolean>(false)
const isLogoutLoading = ref<boolean>(false)


interface Registration {
  username: string
  password: string
  passwordConfirmation: string
}

const registrationForm = ref<FormInst | null>(null)
const registration = ref<Registration>({
  username: '',
  password: '',
  passwordConfirmation: '',
})


function validatePasswordSame(rule: FormItemRule, value: string): boolean {
  return value === registration.value.password
}

const rules: FormRules = {
  username: [
    {required: true, message: 'Username is required', trigger: ['blur', 'change']},
    {min: 5, max: 32, message: 'Password must be at least 8 characters', trigger: ['blur', 'change']},
  ],
  password: [
    {required: true, message: 'Password is required', trigger: ['blur', 'change']},
    {min: 5, max: 32, message: 'Password must be at least 8 characters', trigger: ['blur', 'change']},
  ],
  passwordConfirmation: [
    {required: true, message: 'Password Confirmation is required', trigger: ['blur', 'change']},
    {min: 5, max: 32, message: 'Password must be at least 8 characters', trigger: ['blur', 'change']},
    {
      validator: validatePasswordSame, message: 'Passwords must match', trigger: ['blur', 'password-input']
    }
  ]
}

async function handleRegister() {
  registrationForm.value?.validate(async (errors) => {
    if (!errors) {
      isRegisterLoading.value = true;
      loadingBar.start()
      try {
        const response = await authStore.register(registration.value)
        message.success(`Registration Successful. Email has been sent to ${registration.value.email}`)
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
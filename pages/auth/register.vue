<template>
  <client-only>
    <n-form v-if="!authStore.user" ref="registrationForm" :model="registration" :rules="rules">
      <n-form-item path="email" label="Email">
        <n-input placeholder="Email" v-model:value="registration.email"></n-input>
      </n-form-item>
      <n-form-item path="password" label="Password">
        <n-input type="password" placeholder="Password" v-model:value="registration.password"></n-input>
      </n-form-item>
      <n-form-item path="passwordConfirmation" label="Password Confirmation">
        <n-input type="password" placeholder="Password Confirmation" v-model:value="registration.passwordConfirmation"></n-input>
      </n-form-item>
      <n-button attr-type="submit" @click="handleRegister" :loading="isRegisterLoading">Register</n-button>
    </n-form>
    <n-button v-if="authStore.user" @click="authStore.logout()" :loading="isLogoutLoading">Log Out</n-button>
  </client-only>
</template>
<script lang="ts" setup>

import type {FormInst, FormItemRule, FormRules} from "naive-ui"

definePageMeta({
  layout: 'auth',
  title: 'Register',
})

const router = useRouter()
const authStore = useAuthStore()
const message = useMessage()
const loadingBar = useLoading()
const isRegisterLoading = ref<boolean>(false)
const isLogoutLoading = ref<boolean>(false)
const {emailExists} = useAuth()

interface Registration {
  email: string
  password: string
  passwordConfirmation: string
}

const registrationForm = ref<FormInst | null>(null)
const registration = ref<Registration>({
  email: '',
  password: '',
  passwordConfirmation: '',
})

function validateEmail(rule: FormItemRule, value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

function validateEmailAlreadyExists(rule: FormItemRule, value: string): Promise<void> {
  return new Promise((resolve, reject) => {
    emailExists(value).then(exists => {
      console.log(exists)
      if (exists) {
        reject(new Error('Email already exists'));
      } else {
        resolve();
      }
    }).catch(error => {
      reject(new Error('Validation failed'));
    });
  });
}

function validatePasswordSame(rule: FormItemRule, value: string): boolean {
  return value === registration.value.password
}

const rules: FormRules = {
  email: [
    {required: true, message: 'Email is required', trigger: ['blur', 'change']},
    {min: 5, max: 32, message: 'Password must be at least 8 characters', trigger: ['blur', 'change']},
    {validator: validateEmail, message: 'Email is invalid', trigger: ['blur', 'change']},
    {validator: validateEmailAlreadyExists, message: 'An Account with this email already exists.', trigger: ['change']}
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
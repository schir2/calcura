<template>
  <div v-if="registrationSuccess" class="text-center">
    <h2 class="text-xl font-semibold mb-2">Check your email</h2>
    <p>We sent a verification link to <strong>{{ registeredEmail }}</strong>. Please click the link in the email to activate your account before logging in.</p>
    <n-button class="mt-4" @click="$router.push('/auth/login/')">Go to Login</n-button>
  </div>
  <n-form v-else-if="!isAuthenticated" ref="registrationForm" :model="registration" :rules="rules">
    <n-form-item path="email" label="Email">
      <n-input placeholder="Email" v-model:value="registration.email"></n-input>
    </n-form-item>
    <n-form-item path="password" label="Password">
      <n-input type="password" placeholder="Password" v-model:value="registration.password"></n-input>
    </n-form-item>
    <n-form-item path="passwordConfirmation" label="Password Confirmation">
      <n-input type="password" placeholder="Password Confirmation"
               v-model:value="registration.passwordConfirmation"></n-input>
    </n-form-item>
    <n-form-item>
      <div class="grid grid-cols-2 w-full gap-2">
        <n-button type="primary" attr-type="submit" @click="handleRegister" :loading="isRegisterLoading">Register
        </n-button>
        <n-button @click="$router.push('/auth/login/')">Login</n-button>
      </div>
    </n-form-item>
  </n-form>
  <n-button v-if="isAuthenticated" @click="auth.logout()" :loading="isLogoutLoading">Log Out</n-button>
</template>
<script lang="ts" setup>

import type {FormInst, FormItemRule, FormRules} from "naive-ui"

definePageMeta({
  layout: 'auth',
  title: 'Register',
})

const router = useRouter()
const auth = useAuth()
const {isAuthenticated} = auth
const message = useMessage()
const loadingBar = useLoadingBar()
const isRegisterLoading = ref<boolean>(false)
const isLogoutLoading = ref<boolean>(false)
const registrationSuccess = ref<boolean>(false)
const registeredEmail = ref<string>('')

type Registration = {
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

function validatePasswordSame(rule: FormItemRule, value: string): boolean {
  return value === registration.value.password
}

const rules: FormRules = {
  email: [
    {required: true, message: 'Email is required', trigger: ['blur', 'change']},
    {min: 5, max: 254, message: 'Email must be at least 5 characters', trigger: ['blur', 'change']},
    {validator: validateEmail, message: 'Email is invalid', trigger: ['blur', 'change']},
  ],
  password: [
    {required: true, message: 'Password is required', trigger: ['blur', 'change']},
    {min: 8, max: 128, message: 'Password must be at least 8 characters', trigger: ['blur', 'change']},
  ],
  passwordConfirmation: [
    {required: true, message: 'Password Confirmation is required', trigger: ['blur', 'change']},
    {min: 8, max: 128, message: 'Password must be at least 8 characters', trigger: ['blur', 'change']},
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
        await auth.register(registration.value.email, registration.value.password)
        registeredEmail.value = registration.value.email
        registrationSuccess.value = true
        loadingBar.finish()
      } catch (error: any) {
        message.error(error?.message ?? 'Registration failed')
        loadingBar.error()
      } finally {
        isRegisterLoading.value = false;
      }
    }
  })
}
</script>

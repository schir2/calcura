<!-- pages/verify/[key].vue (Nuxt 3) -->
<template>
  <div>
    <h1>Email Verification</h1>
    <p v-if="loading">Verifying your email...</p>
    <p v-else-if="error">{{ error }}</p>
    <p v-else-if="success">Your account has been verified! You can now log in.</p>
  </div>
</template>

<script setup lang="ts">
const {verify, } = useAuthStore()

const route = useRoute()
const verificationKey = route.query.key as string
const loadingBar = useLoading()
const router = useRouter()
const message = useMessage()

const loading = ref(true)
const error = ref('')
const success = ref(false)

onMounted(async () => {
  try {
    loadingBar.start()
    await verify(verificationKey)
    message.success(`You have been verified!`)
    loadingBar.finish()
    router.push('/')
  } catch (err) {
    error.value = 'Verification failed or link invalid.'
    loadingBar.error()
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <p class="text-center">Signing you in...</p>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  title: 'Signing in',
})

const user = useSupabaseUser()
const router = useRouter()
const message = useMessage()

function finish() {
  message.success('Login Successful')
  router.replace('/dashboard')
}

onMounted(() => {
  if (user.value) {
    finish()
    return
  }
  const stop = watch(user, (newUser) => {
    if (newUser) {
      stop()
      finish()
    }
  })
})
</script>

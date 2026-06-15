<!-- Supabase handles email verification via a link in the email. When the user
     clicks the link they are redirected back to the app with a session cookie set.
     This page simply waits for the Supabase session to resolve and redirects. -->
<template>
  <div class="text-center">
    <p v-if="loading">Verifying your email...</p>
    <p v-else-if="error">{{ error }}</p>
    <p v-else>Verification successful! Redirecting...</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  title: 'Verify Email',
})

const user = useSupabaseUser()
const router = useRouter()
const loadingBar = useLoadingBar()
const message = useMessage()

const loading = ref(true)
const error = ref('')

onMounted(async () => {
  loadingBar.start()
  // Give Supabase a moment to process the auth callback tokens from the URL
  // (the @nuxtjs/supabase module handles the token exchange automatically)
  await nextTick()

  if (user.value) {
    message.success('Email verified! Welcome.')
    loadingBar.finish()
    await router.push('/')
  } else {
    // Watch for the user to be set after Supabase processes the callback
    const stop = watch(user, (newUser) => {
      if (newUser) {
        stop()
        message.success('Email verified! Welcome.')
        loadingBar.finish()
        router.push('/')
      }
    })

    // Timeout after 5 seconds if no session is established
    setTimeout(() => {
      if (!user.value) {
        stop()
        error.value = 'Verification failed or link has expired. Please try registering again.'
        loadingBar.error()
        loading.value = false
      }
    }, 5000)
  }

  loading.value = false
})
</script>

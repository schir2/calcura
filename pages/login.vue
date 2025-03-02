<script setup lang="ts">
const supabase = useSupabaseClient()
const email = ref('')

const signInWithOtp = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  })
  if (error) console.log(error)
}
</script>
<template>
  <div>
    <n-button @click="signInWithOtp">
      Sign In with E-Mail
    </n-button>
    <n-input
        v-model="email"
    />
  </div>
</template>

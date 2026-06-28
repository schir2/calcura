<script setup lang="ts">
const router = useRouter()
const auth = useAuth()
const {isAuthenticated} = auth
const message = useMessage()

async function handleLogout() {
  try {
    await auth.logout()
    message.info('Logged out')
  } catch (error) {
    message.error('Logout failed. Please try again.')
  } finally {
    await router.push('/')
  }
}

</script>
<template>
  <n-layout-header class="pt-3 pb-2 px-4">
    <nav class="justify-between items-center flex">
      <n-button quaternary @click="router.push('/')">
        <span class="flex gap-2 items-center">
        <img class="h-8 inline-block" src="~/assets/img/logos/calcura-logo.svg" alt="logo"/>
        <span class="text-xl">Calcura</span>
        </span>
      </n-button>
      <ul class="flex items-center gap-2">
        <client-only>
          <n-button v-if="isAuthenticated" @click="handleLogout()">Logout</n-button>
          <n-button keyboard v-if="!isAuthenticated" @click="$router.push('/auth/login')">Login</n-button>
          <n-avatar circle v-if="isAuthenticated">
            <icon class="text-xl" name="mdi:user"/>
          </n-avatar>
        </client-only>
        <base-theme-switcher/>
      </ul>
    </nav>


  </n-layout-header>
</template>
<template>
  <n-layout-header :inverted="true" class="p-3">
    <n-space justify="space-between" align="center">
      <nav>
        <n-button>Home</n-button>
      </nav>
      <nav class="flex items-center space-x-3">
        <ClientOnly>
          <n-button v-if="authStore.isAuthenticated" @click="handleLogout()">Logout</n-button>
          <n-button keyboard v-if="!authStore.user" @click="$router.push('/auth/login')">Login</n-button>
          <n-avatar v-if="authStore.user">
            {{ authStore.user.username }}
          </n-avatar>
        </ClientOnly>
      </nav>
    </n-space>




  </n-layout-header>
</template>
<script setup lang="ts">
const router = useRouter()
const menu = ref({open: false})
const authStore = useAuthStore()
const message = useMessage()

async function handleLogout() {
  await authStore.logout()
  message.info('Logged out')
  await router.push('/')

}

const toggleMenu = () => {
  menu.value.open = !menu.value.open;
}

onMounted(async () => {
  if (!authStore.user) {
    await authStore.fetchUser()
  }
})
</script>
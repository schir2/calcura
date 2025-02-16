<template>
  <n-layout-header :inverted="true" class="pt-3 pb-2 px-4">
    <nav class="justify-between items-center flex">
      <ul>
        <n-button>Home</n-button>
      </ul>
      <ul class="flex items-center gap-2">
        <ClientOnly>
          <n-button v-if="authStore.isAuthenticated" @click="handleLogout()">Logout</n-button>
          <n-button keyboard v-if="!authStore.user" @click="$router.push('/auth/login')">Login</n-button>
          <n-avatar circle v-if="authStore.user">
            <icon class="text-xl" name="mdi:user" />
          </n-avatar>
        </ClientOnly>
      </ul>
    </nav>


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
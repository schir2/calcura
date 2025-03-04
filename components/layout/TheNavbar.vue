<template>
  <n-layout-header :inverted="true" class="pt-3 pb-2 px-4">
    <nav class="justify-between items-center flex">
      <n-button quaternary @click="router.push('/')">
        <span class="flex gap-2 items-center">
        <img class="h-8 inline-block" src="/assets/img/logos/calcura-logo.svg" alt="logo"/>
        <span class="text-xl">Calcura</span>
        </span>
      </n-button>
      <ul class="flex items-center gap-2">
        <ClientOnly>
          <n-button v-if="isAuthenticated" @click="handleLogout()">Logout</n-button>
          <n-button keyboard v-if="!authStore.user" @click="$router.push('/auth/login')">Login</n-button>
          <n-avatar circle v-if="user">
            <icon class="text-xl" name="mdi:user"/>
          </n-avatar>
        </ClientOnly>
        <base-theme-switcher/>
      </ul>
    </nav>


  </n-layout-header>
</template>
<script setup lang="ts">
const router = useRouter()
const menu = ref({open: false})
const authStore = useAuthStore()
const {isAuthenticated, user} = storeToRefs(authStore)
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
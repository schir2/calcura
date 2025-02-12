<template>
  <NuxtLoadingIndicator/>
  <nav class="bg-skin-surface shadow-md h-16 w-full flex justify-center items-center px-4 sm:px-8 lg:px-16">
    <NButton
        class="sm:hidden text-skin-secondary/80 hover:text-skin-secondary font-normal ease-in-out duration-500 transition-all"
        @click="toggleMenu"
    >
      <Icon name="uil:book"/>
    </NButton>
    <div class="flex w-full justify-between items-center container space-x-3">
      <div class="flex-1 space-x-3 items-center hidden sm:flex">
        <NButton>
          <NuxtLink to="/">Home</NuxtLink>
        </NButton>
        <NButton>
          <NuxtLink to="/plans">Plans</NuxtLink>
        </NButton>
      </div>
      <nav class="flex items-center space-x-3">
        <ClientOnly>
          <NButton v-if="authStore.isAuthenticated" @click="handleLogout()">Logout</NButton>
          <NButton keyboard v-if="!authStore.user">
            <NuxtLink to='/login'>Login</NuxtLink>
          </NButton>
          <n-avatar v-if="authStore.user">
            {{ authStore.user.username }}
          </n-avatar>
        </ClientOnly>
      </nav>
      <div v-show="menu.open"
           class="absolute top-16 left-0 w-full bg-skin-surface shadow-md sm:hidden flex flex-col items-start space-y-2 p-4"
           @click.self="menu.open = false">
        <span>responsive</span>
      </div>
    </div>
  </nav>
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
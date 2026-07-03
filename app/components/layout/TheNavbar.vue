<script setup lang="ts">
import type {DropdownOption} from 'naive-ui'
import {Icon} from '#components'

const router = useRouter()
const auth = useAuth()
const {isAuthenticated} = auth
const user = useSupabaseUser()
const message = useMessage()

function renderIcon(name: string) {
  return () => h(Icon, {name})
}

const userOptions = computed<DropdownOption[]>(() => [
  {key: 'email', type: 'render', render: () => h('div', {class: 'px-3 py-2 text-skin-muted text-sm'}, user.value?.email ?? '')},
  {type: 'divider', key: 'divider'},
  {key: 'profile', label: 'Profile', icon: renderIcon('mdi:account-outline')},
  {key: 'logout', label: 'Logout', icon: renderIcon('mdi:logout')},
])

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

function handleUserSelect(key: string) {
  if (key === 'profile') router.push('/profile')
  if (key === 'logout') handleLogout()
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
          <n-button v-if="isAuthenticated" type="primary" @click="router.push('/dashboard')">Dashboard</n-button>
          <n-button keyboard v-if="!isAuthenticated" @click="router.push('/auth/login')">Login</n-button>
          <n-dropdown
              v-if="isAuthenticated"
              trigger="click"
              :options="userOptions"
              @select="handleUserSelect"
          >
            <n-avatar circle class="cursor-pointer">
              <icon class="text-xl" name="mdi:user"/>
            </n-avatar>
          </n-dropdown>
        </client-only>
        <base-theme-switcher/>
      </ul>
    </nav>
  </n-layout-header>
</template>

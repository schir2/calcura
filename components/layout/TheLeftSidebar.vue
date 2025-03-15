<template>
    <div class="mr-2">
      <n-layout-sider
          class="min-h-nav-offset"
          style="width:12rem;"
          bordered
          collapse-mode="width"
          :collapsed-width="64"
          :collapsed="collapsed"
          show-trigger
          @collapse="collapsed = true"
          @expand="collapsed = false"
          :native-scrollbar="false"
      >
        <n-menu v-if="authStore.isAuthenticated"
                :collapsed="collapsed"
                :collapsed-width="64"
                :collapsed-icon-size="22"
                :options="menuOptions"
        />
      </n-layout-sider>
    </div>
</template>
<script setup lang="ts">
import type {MenuOption} from 'naive-ui'
import {Icon} from '#components'

function renderIcon(name: string) {
  return () => h(Icon, {name: name})
}

function renderLabel(label: string, to: string) {
  return () => h('span', {class: 'n-menu-label'}, [
    h(resolveComponent('NuxtLink'), {to, class: 'n-menu-link'}, () => label)
  ])
}

const authStore = useAuthStore()
const collapsed = ref<boolean>(false)
const menuOptions: MenuOption[] = [
  {label: renderLabel('Home', '/'), key: 'home', icon: renderIcon('uil:home'),},
  {label: renderLabel('Dashboard', '/dashboard'), key: 'dashboard', icon: renderIcon('uil:create-dashboard'),},
  {label: renderLabel('Plan', '/plans'), key: 'plans', icon: renderIcon('mdi:flower-poppy'),},
]
</script>
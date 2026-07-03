<script setup lang="ts">
import type {MenuOption} from 'naive-ui'
import {Icon} from '#components'
import {tools, isAvailable} from '~/constants/tools'

function renderIcon(name: string) {
  return () => h(Icon, {name})
}

function renderLink(label: string, to: string) {
  return () => h('span', {class: 'n-menu-label'}, [
    h(resolveComponent('NuxtLink'), {to, class: 'n-menu-link'}, () => label)
  ])
}

function renderComingSoon(label: string) {
  return () => h('span', {class: 'flex items-center gap-2'}, [
    h('span', label),
    h('span', {class: 'text-xs text-skin-muted'}, 'soon'),
  ])
}

const {isAuthenticated} = useAuth()
const collapsed = ref<boolean>(false)

const menuOptions: MenuOption[] = [
  {
    key: 'dashboard',
    icon: renderIcon('uil:create-dashboard'),
    label: renderLink('Dashboard', '/dashboard'),
  },
  ...tools.map((tool): MenuOption => ({
    key: tool.id,
    icon: renderIcon(tool.icon),
    disabled: !isAvailable(tool),
    label: isAvailable(tool)
        ? renderLink(tool.label, tool.route!)
        : renderComingSoon(tool.label),
  })),
]
</script>

<template>
  <div class="mr-2">
    <n-layout-sider
        class="min-h-nav-offset"
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :collapsed="collapsed"
        show-trigger
        @collapse="collapsed = true"
        @expand="collapsed = false"
        :native-scrollbar="false"
    >
      <n-menu v-if="isAuthenticated"
              :collapsed="collapsed"
              :collapsed-width="64"
              :collapsed-icon-size="22"
              :options="menuOptions"
      />
    </n-layout-sider>
  </div>
</template>

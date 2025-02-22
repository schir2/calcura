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
  {label: renderLabel('Dashboard', '/dashboard'), key: 'dashboard', icon: renderIcon('uil:create-dashboard'),},
  {label: renderLabel('Plans', '/plans'), key: 'plans', icon: renderIcon('mdi:flower-poppy'),},
  {label: renderLabel('Incomes', '/incomes'), key: 'incomes', icon: renderIcon('mdi:currency-usd'),},
  {label: renderLabel('Expenses', '/expenses'), key: 'expenses', icon: renderIcon('mdi:cash-minus'),},
  {label: renderLabel('Debts', '/debts'), key: 'debts', icon: renderIcon('mdi:trending-down'),},
  {label: renderLabel('Cash Reserves', '/cash-reserves'), key: 'cash-reserves', icon: renderIcon('mdi:bank'),},
  {label: renderLabel('401ks', '/401ks'), key: '401ks', icon: renderIcon('mdi:finance'),},
  {label: renderLabel('IRAs', '/iras'), key: 'iras', icon: renderIcon('mdi:finance'),},
  {label: renderLabel('Roth', '/roth-iras'), key: 'roth-iras', icon: renderIcon('mdi:finance'),},
  {label: renderLabel('Brokerages', '/brokerages'), key: 'brokerages', icon: renderIcon('mdi:finance'),},
]
</script>
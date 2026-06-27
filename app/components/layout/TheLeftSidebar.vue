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

const {isAuthenticated} = useAuth()
const collapsed = ref<boolean>(false)
const menuOptions: MenuOption[] = [
  {label: renderLabel('Home', '/'), key: 'home', icon: renderIcon('uil:home'),},
  {label: renderLabel('Dashboard', '/dashboard'), key: 'dashboard', icon: renderIcon('uil:create-dashboard'),},
  {label: renderLabel('Plans', '/plans'), key: 'plans', icon: renderIcon('mdi:flower-poppy'),},
  {label: renderLabel('Incomes', '/incomes'), key: 'incomes', icon: renderIcon('mdi:cash'),},
  {label: renderLabel('Expenses', '/expenses'), key: 'expenses', icon: renderIcon('mdi:cart-outline'),},
  {label: renderLabel('Debts', '/debts'), key: 'debts', icon: renderIcon('mdi:credit-card-outline'),},
  {label: renderLabel('Brokerages', '/brokerages'), key: 'brokerages', icon: renderIcon('mdi:chart-line'),},
  {label: renderLabel('Cash Reserves', '/cash-reserves'), key: 'cash-reserves', icon: renderIcon('mdi:piggy-bank-outline'),},
  {label: renderLabel('IRAs', '/iras'), key: 'iras', icon: renderIcon('mdi:bank-outline'),},
  {label: renderLabel('Roth IRAs', '/roth-iras'), key: 'roth-iras', icon: renderIcon('mdi:bank-plus'),},
  {label: renderLabel('401ks', '/401ks'), key: '401ks', icon: renderIcon('mdi:briefcase-outline'),},
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
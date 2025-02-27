<template>
  <Icon :name="getIconifyName(name)"/>
</template>

<script setup lang="ts">
import {ModelName} from "~/types/ModelName";

interface Props {
  name: IconName;
}

const props = defineProps<Props>();

const iconMap = {
  taxDeferredInvestment: 'mdi:finance',
  brokerageInvestment: 'mdi:finance',
  iraInvestment: 'mdi:finance',
  rothIraInvestment: 'mdi:finance',
  brokerage: 'mdi:finance',
  cashReserve: 'mdi:bank',
  debt: 'mdi:trending-down',
  expense: 'mdi:cash-minus',
  income: 'mdi:currency-usd',
  ira: 'mdi:finance',
  plan: 'mdi:flower-poppy',
  roth: 'mdi:finance',
  dashboard: 'uil:create-dashboard',
}

type IconName = keyof typeof iconMap


function getIconifyName(name: IconName): string {
  return iconMap[name] ?? 'mdi:home'
}
</script>
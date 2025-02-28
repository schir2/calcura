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
  more: 'material-symbols:more-vert',
  create: 'mdi:add-circle',
  remove: 'material-symbols:close',
  delete: 'material-symbols:delete',
  add: 'material-symbols:add',
  taxDeferred: 'mdi:finance',
  brokerage: 'mdi:finance',
  ira: 'mdi:finance',
  rothIra: 'mdi:finance',
  cashReserve: 'mdi:bank',
  debt: 'mdi:trending-down',
  expense: 'mdi:cash-minus',
  income: 'mdi:currency-usd',
  plan: 'mdi:flower-poppy',
  roth: 'mdi:finance',
  dashboard: 'uil:create-dashboard',
}

type IconName = keyof typeof iconMap


function getIconifyName(name: IconName): string {
  return iconMap[name] ?? 'mdi:home'
}
</script>
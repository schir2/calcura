<template>
  <Icon :name="getIconifyName()" />
</template>

<script setup lang="ts">

type iconName = '401k' | 'brokerage' | 'cashReserve' | 'debt' | 'expense' | 'income' | 'ira' | 'plan' | 'roth' | 'dashboard';

interface Props {
  name: iconName;
}

const props = defineProps<Props>();

function getIconifyName(): string {
  switch (props.name) {
    case '401k':
      return 'mdi:finance';
    case 'brokerage':
      return 'mdi:finance';
    case 'cashReserve':
      return 'mdi:bank';
    case 'debt':
      return 'mdi:trending-down';
    case 'expense':
      return 'mdi:cash-minus';
    case 'income':
      return 'mdi:currency-usd';
    case 'ira':
      return 'mdi:finance';
    case 'plan':
      return 'mdi:flower-poppy';
    case 'roth':
      return 'mdi:finance';
    case 'dashboard':
      return 'uil:create-dashboard';
    default:
      return ''; // Handle unknown icon names
  }
}
</script>
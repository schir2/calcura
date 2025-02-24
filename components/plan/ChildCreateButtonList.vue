<template>
  <n-button v-for="item in items">
    <template #icon><BaseIco :name="item.name"/></template>
  </n-button>
</template>
<script setup lang="ts">
import {ModelNames} from "~/types/ModelNames";

defineEmits(['create'])

const items: {name: ModelNames, label: string}[] = [
  {name: ModelNames.TaxDeferredInvestment, label: '401k'},
  {name: ModelNames.BrokerageInvestment, label: 'Brokerage'},
  {name: ModelNames.CashReserve, label: 'Cash Reserve'},
  {name: ModelNames.Debt, label: 'Debt'},
  {name: ModelNames.Expense, label: 'Expense'},
  {name: ModelNames.Income, label: 'Income'},
  {name: ModelNames.IraInvestment, label: 'IRA'},
  {name: ModelNames.RothIraInvestment, label: 'Roth'}
];
</script>
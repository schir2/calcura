<template>
  <n-card>
    <h3 class="text-2xl">Expenses</h3>
    <ul v-if="expenses" class="space-y-1">
      <li v-for="(expense, index) in expenses" :Key="index" class="flex justify-between">
        <div class="space-y-1">
          <p>{{ expense.name }}</p>
          <p>
            <n-tag size="small">
              <template #icon>
                <Icon v-if="expense.expenseType==='fixed'" name="mdi-lock"/>
                <Icon v-else-if="expense.expenseType==='variable'" name="mdi-tune"/>
              </template>
              {{ expense.expenseType }}
            </n-tag>
            <n-tag size="small" type="info">
              <template #icon>
                <Icon name="mdi-calendar"></Icon>
              </template>
              {{ expense.frequency }}
            </n-tag>
            <n-tag size="small" v-if="expense.growthRate && !expense.growsWithInflation">
              <template #icon>
                <Icon name="mdi:trending-up"></Icon>
              </template>
              {{ expense.growthRate }}%
            </n-tag>
            <n-tag size="small" type="warning" v-if="expense.growsWithInflation">
              <template #icon>
                <Icon name="mdi:trending-up"/>
              </template>
              Inflation
            </n-tag>
            <n-tag size="small" type="success" v-if="expense.isTaxDeductible">
              <template #icon>
                <Icon name="mdi:cash"/>
              </template>
              Tax Deductible
            </n-tag>
            <n-tag size="small" type="error" v-if="expense.isEssential">
              <template #icon>
                <Icon name="uil:exclamation-circle"></Icon>
              </template>
              Essential
            </n-tag>
          </p>
        </div>
        <span class="text-end text-lg">${{ $humanize.intComma(getAnnualAmount(expense.amount, expense.frequency)) }}</span>
      </li>
    </ul>
    <n-divider title-placement="center">Total</n-divider>
    <n-statistic class="text-end">${{ $humanize.intComma(totalExpense) }}</n-statistic>
  </n-card>

</template>

<script setup lang="ts">

import {type Expense} from "~/models/expense/Expense";

import {getAnnualAmount} from "~/utils";

interface Props {
  expenses: Expense[]
}

const props = defineProps<Props>()
const totalExpense = computed(() => {
  return props.expenses.reduce((total, expense) => total + getAnnualAmount(expense.amount, expense.frequency), 0)
})

</script>
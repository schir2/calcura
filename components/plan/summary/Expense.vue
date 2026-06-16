<template>
  <n-card>
    <template #header>
      <span class="text-2xl">
        <Icon name="uil:money-withdraw"/>
        Expenses
      </span>
    </template>
    <n-list v-if="expenses" class="space-y-1">
      <n-list-item v-for="(expense, index) in expenses" :Key="index">
        <div class="flex justify-between">
          <div class="space-y-1">
          <span class="text-lg">{{ expense.name }}</span>
          <div class="flex gap-1 items-end">

            <n-tag size="small">
              <template #icon>
                <Icon v-if="expense.expense_type==='fixed'" name="mdi-lock"/>
                <Icon v-else-if="expense.expense_type==='variable'" name="mdi-tune"/>
              </template>
              {{ expense.expense_type }}
            </n-tag>
            <n-tag size="small" type="info">
              <template #icon>
                <Icon name="mdi-calendar"></Icon>
              </template>
              {{ expense.frequency }}
            </n-tag>
            <n-tag size="small" v-if="expense.growth_rate && !expense.grows_with_inflation">
              <template #icon>
                <Icon name="mdi:trending-up"></Icon>
              </template>
              {{ expense.growth_rate }}%
            </n-tag>
            <n-tag size="small" type="warning" v-if="expense.grows_with_inflation">
              <template #icon>
                <Icon name="mdi:trending-up"/>
              </template>
              Inflation
            </n-tag>
            <n-tag size="small" type="success" v-if="expense.is_tax_deductible">
              <template #icon>
                <Icon name="mdi:cash"/>
              </template>
              Tax Deductible
            </n-tag>
            <n-tag size="small" type="error" v-if="expense.is_essential">
              <template #icon>
                <Icon name="uil:exclamation-circle"></Icon>
              </template>
              Essential
            </n-tag>
          </div>
          </div>
          <div class="text-end text-lg">${{
              $humanize.intComma(getAnnualAmount(expense.amount, expense.frequency))
            }}
          </div>
        </div>
      </n-list-item>
      <n-list-item>

        <p class="text-end text-2xl">${{ $humanize.intComma(totalExpense) }}</p>
      </n-list-item>
    </n-list>
  </n-card>

</template>

<script setup lang="ts">

import {type Expense} from "~/types/Expense";

import {getAnnualAmount} from "~/utils";

type Props = {
  expenses: Expense[]
}

const props = defineProps<Props>()
const totalExpense = computed(() => {
  return props.expenses.reduce((total, expense) => total + getAnnualAmount(expense.amount, expense.frequency), 0)
})

</script>
<script lang="ts" setup>
import {type Expense, ExpenseType} from "~/types/Expense";
import {darkTheme} from "naive-ui";
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from 'chart.js'
import {Doughnut} from 'vue-chartjs'

interface Props {
  expenses?: Expense[]
}

const {expenses = []} = defineProps<Props>()

ChartJS.register(ArcElement, Tooltip, Legend)

const data = computed(() => {
  const expenseMap = {
    essentialFixed: 0,
    essentialVariable: 0,
    discretionaryFixed: 0,
    discretionaryVariable: 0,
  }


  for (const expense of expenses) {
    const annualExpense = getAnnualAmount(expense.amount, expense.frequency)
    if (expense.isEssential && expense.expenseType === ExpenseType.fixed) {
      expenseMap.essentialFixed += annualExpense
    } else if (expense.isEssential && expense.expenseType === ExpenseType.variable) {
      expenseMap.essentialVariable += annualExpense
    } else if (!expense.isEssential && expense.expenseType === ExpenseType.fixed) {
      expenseMap.discretionaryFixed += annualExpense
    } else if (!expense.isEssential && expense.expenseType === ExpenseType.variable) {
      expenseMap.discretionaryVariable += annualExpense
    }
  }
  return {
    labels: ['Essential/Fixed', 'Essential/Variable', 'Discretionary/Fixed', 'Discretionary/Variable'],
    datasets: [
      {
        borderWidth: 3,
        backgroundColor: [
          darkTheme.common.infoColor,
          darkTheme.common.warningColor,
          darkTheme.common.errorColor,
          darkTheme.common.successColor,
        ],
        borderColor: [
          darkTheme.common.infoColorPressed,
          darkTheme.common.warningColorPressed,
          darkTheme.common.errorColorPressed,
          darkTheme.common.successColorPressed,
        ],
        data: [
          expenseMap.essentialFixed,
          expenseMap.essentialVariable,
          expenseMap.discretionaryFixed,
          expenseMap.discretionaryVariable,
        ]
      },
    ]
  }
})

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: "top",
      labels: {
        color: darkTheme.common.textColorBase,
      }
    },
    tooltip: {
      bodyFont: {
        size: 12
      },
      padding: 10,
      backgroundColor: darkTheme.common.popoverColor,
      titleColor: darkTheme.common.textColorBase,
      bodyColor: darkTheme.common.textColorBase,
    }
  },
  layout: {
    backgroundColor: darkTheme.common.bodyColor,
    padding: 8,
  },
}

</script>
<template>
  <Doughnut v-if="data" :data="data" :options="options"/>
</template>
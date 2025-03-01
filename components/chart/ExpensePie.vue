<script lang="ts" setup>
import {type Expense, ExpenseType} from "~/types/Expense";
import {darkTheme} from "naive-ui";
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from 'chart.js'
import {Doughnut} from 'vue-chartjs'
import type {Debt} from "~/types/Debt";
import {calculateDebtPayment} from "~/models/debt/DebtManager";

interface Props {
  expenses?: Expense[]
  debts?: Debt[]
}

const {expenses = [], debts = []} = defineProps<Props>()

ChartJS.register(ArcElement, Tooltip, Legend)

const expenseMap = computed(() => {
  const expenseMap = {
    essentialFixed: 0,
    essentialVariable: 0,
    discretionaryFixed: 0,
    discretionaryVariable: 0,
    lowInterestDebt: 0,
    mediumInterestDebt: 0,
    highInterestDebt: 0,
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

  for (const debt of debts) {
    if (debt.interestRate <= 6) {
      expenseMap.lowInterestDebt = calculateDebtPayment(debt, debt.principal)
    } else if (debt.interestRate < 8) {
      expenseMap.mediumInterestDebt = calculateDebtPayment(debt, debt.principal)
    } else {
      expenseMap.highInterestDebt = calculateDebtPayment(debt, debt.principal)
    }
  }
  return expenseMap

})
const annualExpenses = computed(() => {
  return Object.values(expenseMap.value).reduce((acc, cur) => acc + cur, 0)
})

const borderColor = 'black'

const chartColors = {
  essentialFixed: {
    background: "#5DADE2",
    border: borderColor,
  },
  essentialVariable: {
    background: "#48C9B0",
    border: borderColor,
  },
  discretionaryFixed: {
    background: "#F4D03F",
    border: borderColor,
  },
  discretionaryVariable: {
    background: "#E67E22",
    border: borderColor,
  },
  lowInterestDebt: {
    background: "#F1948A",
    border: borderColor,
  },
  medInterestDebt: {
    background: "#EC7063",
    border: borderColor,
  },
  highInterestDebt: {
    background: "#CB4335",
    border: borderColor,
  },
};


const data = computed(() => {

  return {
    labels: [
      'Essential/Fixed',
      'Essential/Variable',
      'Discretionary/Fixed',
      'Discretionary/Variable',
      'Low Interest Debt',
      'Med Interest Debt',
      'High Interest Debt',
    ],
    datasets: [
      {
        borderWidth: 1,
        data: Object.values(expenseMap.value),
        backgroundColor: Object.values(chartColors).map(color => color.background),
        borderColor: Object.values(chartColors).map(color => color.border)

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
  },
}

</script>
<template>
  <n-card size="small" class="max-w-sm" :bordered="true">
    <template #header>
      <h4 class="text-2xl font-semibold flex gap-2 items-center">
        <base-ico class="text-skin-warning" name="expense"/>
        <span>Annual Expenses</span></h4>
    </template>
    <Doughnut v-if="data" :data="data" :options="options"/>
    <template #footer>
      <p class="text-2xl text-skin-error text-end">-${{ $humanize.intComma(annualExpenses) }}/Year</p>
    </template>
  </n-card>
</template>
<template>
  <n-table size="small">
    <thead>
    <tr>
      <th></th>
      <th colspan="5">Income</th>
      <th colspan="2">Capital</th>
      <th colspan="1"></th>
      <th colspan="3">Expenses</th>
      <th colspan="4">Savings</th>
    </tr>
    <tr>
      <th>Age</th>
      <th>Gross</th>
      <th>Taxable</th>
      <th>Taxed</th>
      <th>Projected</th>
      <th>Goal</th>
      <th>Taxed</th>
      <th>Taxable</th>
      <th>Withdrawals</th>
      <th>Total</th>
      <th>Paid</th>
      <th>Shortfall</th>
      <th>Tax Deferred</th>
      <th>Tax Exempt</th>
      <th>Taxable</th>
      <th>Gross</th>

    </tr>

    </thead>
    <tbody>
    <tr class="space-y-3" v-for="state in planStates">
      <td>{{ state.age }}</td>
      <td>${{ $humanize.intComma(state.grossIncome) }}</td>
      <td>${{ $humanize.intComma(state.taxableIncome) }}</td>
      <td>${{ $humanize.intComma(state.taxedIncome) }}</td>
      <td>${{ $humanize.intComma(state.retirementIncomeProjected) }}</td>
      <td>${{ $humanize.intComma(state.retirementIncomeGoal) }}</td>
      <td>${{ $humanize.intComma(state.taxedCapital) }}</td>
      <td>${{ $humanize.intComma(state.taxableCapital) }}</td>
      <td>${{ $humanize.intComma(state.taxedWithdrawals) }}</td>
      <td>${{ $humanize.intComma(state.expensesTotal) }}</td>
      <td>${{ $humanize.intComma(state.expensesPaid) }}</td>
      <td>${{ $humanize.intComma(state.expensesShortfall) }}</td>
      <td>${{ $humanize.intComma(state.savingsTaxDeferredEndOfYear) }}</td>
      <td>${{ $humanize.intComma(state.savingsTaxExemptEndOfYear) }}</td>
      <td>${{ $humanize.intComma(state.savingsTaxableEndOfYear) }}</td>
      <td>${{ $humanize.intComma(state.savingsEndOfYear) }}</td>
    </tr>
    </tbody>
  </n-table>
</template>
<script setup lang="ts">
import type {PlanState} from "~/types/PlanState";

interface Props {
  planStates: PlanState[]
}

const props = defineProps<Props>()
</script>
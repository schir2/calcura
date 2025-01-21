<template>
    <n-table size="small">
      <thead>
      <tr>
        <th>Age</th>
        <th>Gross Income</th>
        <th>Taxable Income</th>
        <th>Taxed Income</th>
        <th>Taxed Capital</th>
        <th>Taxable Capital</th>
        <th>Taxed Withdrawals</th>
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
import type {PlanState} from "~/models/plan/PlanState";

interface Props {planStates: PlanState[]}
const props = defineProps<Props>()
</script>
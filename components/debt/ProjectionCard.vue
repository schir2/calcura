<template>
  <n-card>
    <template #header>{{ title }}</template>
    <n-list>
      <n-list-item>Annual Payment: ${{ $humanize.intComma(projection.totalPaymentsMade) }}</n-list-item>
      <n-list-item>Interest Accrued: ${{ $humanize.intComma(projection.totalInterestAccrued) }}</n-list-item>
      <n-list-item>Years to Pay Off: {{ $humanize.intComma(projection.data).length }}<span
          v-if="!projection.isPaid">+</span></n-list-item>
      <n-list-item>Years to Pay Off: {{ $humanize.intComma(projection.remainingDebt) }}</n-list-item>
    </n-list>
  </n-card>
</template>
<script lang="ts" setup>

interface Props {
  title: string
  projection: DebtProjection
}

const props = defineProps<Props>()

type DebtProjection = {
  data: number[]
  totalPaymentsMade: number
  totalInterestAccrued: number
  isPaid: boolean
  remainingDebt: number
}
</script>
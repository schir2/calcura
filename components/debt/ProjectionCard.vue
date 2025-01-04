<template>
  <n-card
      :style="selectedStyles">
    <template #header>
      <label class="flex justify-between cursor-pointer">
        <span>{{ title }}</span>
        <input type="radio" v-model="model" :value="value"></input>
      </label>
    </template>
    <slot name="inputs"></slot>
    <n-list>
      <n-list-item>
        <p class="flex justify-between">
          <span>Total Paid</span>
          <span>${{ $humanize.intComma(projection.totalPaymentsMade) }}</span>
        </p>
      </n-list-item>
      <n-list-item><p class="flex justify-between">
        <span>Interest Accrued</span>
        <span>${{ $humanize.intComma(projection.totalInterestAccrued) }}</span>
      </p>
      </n-list-item>
      <n-list-item>

        <p class="flex justify-between">
          <span>Years to Pay Off</span>
          <span>{{ projection.data.length - 1 }}<span
              v-if="!projection.isPaid">+</span></span>
        </p></n-list-item>
      <n-list-item>
        <p class="flex justify-between">
          <span>Remaining Debt</span>
          <span>${{ $humanize.intComma(projection.remainingDebt) }}</span>
        </p>
      </n-list-item>
    </n-list>
  </n-card>
</template>
<script lang="ts" setup>
import {darkTheme } from 'naive-ui'

interface Props {
  title: string
  projection: DebtProjection
  value: string | number | boolean

}

const model = defineModel()
const props = defineProps<Props>()

const selected = computed(() => {
  return props.value === model.value
})

type DebtProjection = {
  data: number[]
  totalPaymentsMade: number
  totalInterestAccrued: number
  isPaid: boolean
  remainingDebt: number
}

const selectedStyles = computed(() => {
  if (!selected.value) return {}
  return {
    border: `1px solid ${darkTheme.common.successColor}`,
    backgroundColor: darkTheme.common.hoverColor,
    transition: 'background-color 0.3s, border-color 0.3s'
  }
})
</script>
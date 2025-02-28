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
    <ul class="space-y-2">
      <li>
        <p class="flex justify-between">
          <span>Total Paid</span>
          <span>${{ $humanize.intComma(projection.totalPaymentsMade) }}</span>
        </p>
      </li>
      <li><p class="flex justify-between">
        <span>Interest Accrued</span>
        <span>${{ $humanize.intComma(projection.totalInterestAccrued) }}</span>
      </p>
      </li>
      <li>

        <p class="flex justify-between">
          <span>Years to Pay Off</span>
          <span>{{ projection.data.length - 1 }}<span
              v-if="!projection.isPaid">+</span></span>
        </p></li>
      <li>
        <p class="flex justify-between">
          <span>Remaining Brokerage</span>
          <span>${{ $humanize.intComma(projection.remainingBrokerage) }}</span>
        </p>
      </li>
    </ul>
  </n-card>
</template>
<script lang="ts" setup>
import {darkTheme } from 'naive-ui'

interface Props {
  title: string
  projection: BrokerageProjection
  value: string | number | boolean

}

const model = defineModel()
const props = defineProps<Props>()

const selected = computed(() => {
  return props.value === model.value
})

type BrokerageProjection = {
  data: number[]
  totalPaymentsMade: number
  totalInterestAccrued: number
  isPaid: boolean
  remainingBrokerage: number
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
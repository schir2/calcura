<template>
  <n-select
      v-model:value="model"
      :options="options"
      placeholder="Select the income that funds this"
      clearable
  />
</template>

<script lang="ts" setup>
import type {Income} from "#shared/types/Income";
import {getAnnualAmount} from "~/utils";

type Props = {
  incomes: Income[] | undefined
}
const {incomes} = defineProps<Props>()
const model = defineModel<number | null | undefined>()

const money = (value: number) => '$' + Math.round(value).toLocaleString('en-US')

const options = computed(() =>
    (incomes ?? []).map(income => ({
      label: `${income.name} · ${money(getAnnualAmount(income.gross_income, income.frequency))}/yr`,
      value: income.id,
    }))
)
</script>

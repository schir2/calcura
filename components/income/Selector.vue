<template>
  <n-card>
    <template #header>
      Associate Income
    </template>


    <label class="flex justify-between hover:cursor-pointer hover:bg-skin-surface-hover p-3">
        <span class="flex gap-3 items-center">
          <input type="radio" v-model="model" :value="undefined"/>
          <span class="text-lg">None</span>
        </span>
    </label>
    <template v-for="income in incomes" :key="income.id">

      <label class="flex justify-between hover:cursor-pointer hover:bg-skin-surface-hover p-3">
        <span class="flex gap-3 items-center">
          <input type="radio" v-model="model" :value="income"/>
          <span class="text-lg">{{ income.name }}</span>
          <n-tag>
            {{ income.incomeType }}
          </n-tag>
          <n-tag>
            <template #icon>
              <Icon name="mdi-calendar"></Icon>
            </template>
            {{ income.frequency }}
          </n-tag>
          <n-tag v-if="income.growthRate">
            <template #icon>
              <Icon name="mdi:trending-up"></Icon>
            </template>
            {{ income.growthRate }}%
          </n-tag>
        </span>
        <span class="text-lg">${{
            $humanize.intComma(getAnnualAmount(income.grossIncome, income.frequency))
          }}/year</span>
      </label>
    </template>
  </n-card>
</template>
<script lang="ts" setup>
import type {Income} from "~/types/Income";
import {getAnnualAmount} from "~/utils";

const incomeService = useIncomeService()

interface Props {
  incomes: Income[] | undefined
}

const props = defineProps<Props>()
const model = defineModel()


onMounted(async () => {

})

</script>
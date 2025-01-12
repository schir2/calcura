<template>
  <n-card>
    <template #header>
      Associate Income
    </template>
    <template v-for="income in incomes" :key="income.id">

      <div>
        <CommonRadioCard v-model="model" :value="income" :title="income.name">
          <IncomeListItem :income="income"/>
        </CommonRadioCard>
      </div>
    </template>
  </n-card>
</template>
<script lang="ts" setup>
import type {Income} from "~/models/income/Income";

const incomeService = useIncomeService()

interface Props {
  incomes: Income[] | undefined
}
const props = defineProps<Props>()
const model = defineModel()


onMounted(async () => {

})

</script>
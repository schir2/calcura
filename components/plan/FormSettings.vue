<template>

  <section id="planGrowthAndInflation" class="grid grid-cols-6 gap-2">
    <n-form-item class="col-span-2" path="taxRate" label="Tax Rate (%)">
      <n-input-number class="w-full" v-model:value="modelRef.taxRate"></n-input-number>
    </n-form-item>

    <n-form-item class="col-span-2" path="inflationRate" label="Inflation Rate">
      <n-input-number class="w-full" v-model:value="modelRef.inflationRate"/>
    </n-form-item>
    <n-form-item  class="col-span-3" path="insufficientFundsStrategy" label="Allow Negative Funds">
      <n-radio-group v-model:value="modelRef.insufficientFundsStrategy">
        <n-radio-button v-for="option in insufficientFundsStrategyOptions" :key="option.value"
                        :label="option.label" :value="option.value"/>
      </n-radio-group>
    </n-form-item>

    <n-form-item class="col-span-3" path="growthApplicationStrategy" label="Growth Application Strategy">
      <n-radio-group v-model:value="modelRef.growthApplicationStrategy">
        <n-radio-button v-for="option in growthApplicationStrategyOptions" :key="option.value"
                        :label="option.label" :value="option.value"/>
      </n-radio-group>
    </n-form-item>
  </section>
</template>
<script lang="ts" setup>
const modelRef = defineModel<Plan>()


const insufficientFundsStrategyOptions = [
  {value: 'none', label: 'No'},
  {value: 'minimum_only', label: 'Pay Minimums'},
  {value: 'full', label: 'Allow'},
]

const growthApplicationStrategyOptions = [
  {value: 'start', label: 'Start of Year'},
  {value: 'end', label: 'End of Year'},
]

</script>
<template>

  <section id="planGrowthAndInflation" class="grid grid-cols-6 gap-2">
    <n-form-item class="col-span-2" path="tax_rate" label="Tax Rate (%)">
      <n-input-number class="w-full" v-model:value="modelRef.tax_rate"></n-input-number>
    </n-form-item>

    <n-form-item class="col-span-2" path="inflation_rate" label="Inflation Rate">
      <n-input-number class="w-full" v-model:value="modelRef.inflation_rate"/>
    </n-form-item>
    <n-form-item class="col-span-2" path="growth_application_strategy" label="Growth Application Strategy">
      <n-radio-group v-model:value="modelRef.growth_application_strategy">
        <n-radio-button v-for="option in growthApplicationStrategyOptions" :key="option.value"
                        :label="option.label" :value="option.value"/>
      </n-radio-group>
    </n-form-item>
  </section>
</template>
<script lang="ts" setup>
const modelRef = defineModel<Plan>()


const growthApplicationStrategyOptions = [
  {value: 'start', label: 'Start of Year'},
  {value: 'end', label: 'End of Year'},
]

</script>
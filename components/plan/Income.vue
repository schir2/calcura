<template>
  <CommonCard>
    <h2 class="text-2xl">Income</h2>
    <Form>
      <section>
        <div class="grid grid-cols-6 gap-3">
            <FormField :field="form.name"></FormField>
            <FormField :field="form.grossIncome"></FormField>
            <FormSelect :field="form.growthStrategy"></FormSelect>
            <FormField :field="form.growthRate"></FormField>
            <FormField :field="form.taxRate"></FormField>
            <FormSelect :field="form.taxStrategy"></FormSelect>
        </div>
      </section>
    </Form>
  </CommonCard>

</template>
<script setup lang="ts">
import type {IncomeData} from "~/models/Income";
import {incomeFields} from "~/forms/incomeForm";

interface Props {
  showAdvancedOptions: boolean;
}

const form = reactive(new FormModel<IncomeData>(incomeFields))

const {showAdvancedOptions = false} = defineProps<Props>()
</script>
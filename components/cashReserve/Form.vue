<script lang="ts" setup>
import {type CashReserve, cashReserveDefaults, CashReserveStrategy} from "~/types/CashReserve";

type Props = {
  initialValues?: Partial<CashReserve>;
  mode: 'create' | 'edit'
}

const {initialValues = cashReserveDefaults, mode} = defineProps<Props>();
const emit = defineEmits(["update", "cancel", "create"]);

const {formRef, modelRef, rules, handleCreate, handleUpdate, handleCancel} =
    useCrudFormWithValidation(initialValues, emit, useCashReserveValidation)

const cashReserveStrategyOptions = [
  {label: 'Fixed', value: 'fixed'},
  {label: 'Variable', value: 'variable'}
]

function parse(input: string) {
  const nums = input.replace(/,/g, '').trim()
  if (/^\d+(\.(\d+)?)?$/.test(nums))
    return Number(nums)
  return nums === '' ? null : Number.NaN
}

</script>
<template>
  <n-card role="dialog" class="max-w-lg" :bordered="true">
    <template #header>
      <h3 class="text-2xl">Cash Reserve: {{ modelRef.name }}</h3>
    </template>

    <template #default>
      <n-form ref="formRef" :model="modelRef" :rules="rules" label-placement="left">
        <n-form-item path="name" label="Name">
          <n-input v-model:value="modelRef.name" show-count placeholder="eg: Emergency Funds"/>
        </n-form-item>

        <n-form-item path="initial_amount" label="Initial Amount">
          <n-input-number v-model:value="modelRef.initial_amount"
                          :parse="parse"
                          :format="$humanize.intComma"
                          placeholder="Enter the amount currently in your cash reserve">
            <template #prefix><span class="text-skin-primary/30">$</span></template>
          </n-input-number>
        </n-form-item>

        <n-form-item path="cash_reserve_strategy" label="Cash Reserve Strategy">
          <n-radio-group v-model:value="modelRef.cash_reserve_strategy">
            <n-radio-button v-for="option in cashReserveStrategyOptions" :key="option.value" :value="option.value"
                            :label="option.label"/>
          </n-radio-group>
        </n-form-item>

        <n-form-item :required="modelRef.cash_reserve_strategy===CashReserveStrategy.Fixed" path="reserve_amount"
                     label="Reserve Amount">
          <n-input-number
              v-model:value="modelRef.reserve_amount"
              :precision="2"
              :parse="parse"
              :format="$humanize.intComma"
              placeholder="Enter reserve amount"/>
        </n-form-item>

        <n-form-item :required="modelRef.cash_reserve_strategy===CashReserveStrategy.Variable" path="reserve_months"
                     label="Reserve Months">
          <n-input-number v-model:value="modelRef.reserve_months" :precision="2"
                          placeholder="Enter reserve months"/>
        </n-form-item>
      </n-form>
    </template>

    <template #action>
      <FormActionButtons :mode="mode" @update="handleUpdate"
                         @create="handleCreate" @cancel="handleCancel"/>
    </template>
  </n-card>
</template>
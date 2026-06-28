<script lang="ts" setup>
import type { CashReserve, CashReserveInsert } from "#shared/types/CashReserve"
import { cashReserveRules } from "~/utils/validators/cashReserveRules"
import { cashReserveDefaults } from "~/constants/CashReserveConstants"

type Props = { initialValues?: Partial<CashReserve> }
const props = defineProps<Props>()

const emit = defineEmits<{
  create: [insert: CashReserveInsert]
  cancel: []
}>()

const model = ref<Partial<CashReserve>>({ ...cashReserveDefaults, ...props.initialValues })
const { formRef, pending, rules, apiErrors, onSubmit } = useNaiveForm(model)
const errorMessage = ref('')
rules.value = cashReserveRules(model).rules

const cashReserveStrategyOptions = [
  { label: 'Fixed', value: 'fixed' },
  { label: 'Variable', value: 'variable' }
]

function parse(input: string) {
  const nums = input.replace(/,/g, '').trim()
  if (/^\d+(\.(\d+)?)?$/.test(nums))
    return Number(nums)
  return nums === '' ? null : Number.NaN
}

function handleSubmit() {
  onSubmit(async () => {
    const { id: _id, ...insert } = model.value as CashReserve
    emit('create', insert as CashReserveInsert)
  })
}
</script>
<template>
  <n-card role="dialog" class="max-w-lg" :bordered="true">
    <template #header>
      <h3 class="text-2xl">Cash Reserve: {{ model.name }}</h3>
    </template>

    <template #default>
      <n-alert v-if="Object.keys(apiErrors).length > 0" type="error" :title="errorMessage || 'An error occurred'" class="mb-4" />
      <n-form ref="formRef" :model="model" :rules="rules" label-placement="left">
        <n-form-item path="name" label="Name">
          <n-input v-model:value="model.name" show-count placeholder="eg: Emergency Funds"/>
        </n-form-item>

        <n-form-item path="initial_amount" label="Initial Amount">
          <n-input-number v-model:value="model.initial_amount"
                          :parse="parse"
                          :format="$humanize.intComma"
                          placeholder="Enter the amount currently in your cash reserve">
            <template #prefix><span class="text-skin-primary/30">$</span></template>
          </n-input-number>
        </n-form-item>

        <n-form-item path="cash_reserve_strategy" label="Cash Reserve Strategy">
          <n-radio-group v-model:value="model.cash_reserve_strategy">
            <n-radio-button v-for="option in cashReserveStrategyOptions" :key="option.value" :value="option.value"
                            :label="option.label"/>
          </n-radio-group>
        </n-form-item>

        <n-form-item :required="model.cash_reserve_strategy==='fixed'" path="reserve_amount"
                     label="Reserve Amount">
          <n-input-number
              v-model:value="model.reserve_amount"
              :precision="2"
              :parse="parse"
              :format="$humanize.intComma"
              placeholder="Enter reserve amount"/>
        </n-form-item>

        <n-form-item :required="model.cash_reserve_strategy==='variable'" path="reserve_months"
                     label="Reserve Months">
          <n-input-number v-model:value="model.reserve_months" :precision="2"
                          placeholder="Enter reserve months"/>
        </n-form-item>
      </n-form>
    </template>

    <template #action>
      <FormActionButtons variant="create" @create="handleSubmit" @cancel="emit('cancel')" />
    </template>
  </n-card>
</template>
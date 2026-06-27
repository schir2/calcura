<script lang="ts" setup>
import type { Expense, ExpenseUpdate } from "#shared/types/Expense"
import { getAnnualAmount } from "~/utils"
import { FORM_LABEL_ALIGN, FORM_LABEL_PLACEMENT, FORM_MODAL_WIDTH_CLASS } from "~/constants/FormConstants"

type Props = { id: number }
const props = defineProps<Props>()

const emit = defineEmits<{
  update: [id: number, update: ExpenseUpdate]
  cancel: []
}>()

const store = useExpenseStore()
const model = ref<Partial<Expense>>({})
const isFetching = ref(true)
const errorMessage = ref('')

const { formRef, pending, rules, apiErrors, onSubmit } = useNaiveForm(model)
rules.value = useExpenseValidation(model).rules

onMounted(async () => {
  try {
    const data = await store.fetch(props.id)
    model.value = { ...data }
  } catch {
    emit('cancel')
  } finally {
    isFetching.value = false
  }
})

function handleSubmit() {
  onSubmit(async () => {
    const { id: _id, ...update } = model.value as Expense
    emit('update', props.id, update as ExpenseUpdate)
  })
}
</script>
<template>
  <n-spin v-if="isFetching" />
  <n-card v-else role="dialog" :class="FORM_MODAL_WIDTH_CLASS" :bordered="true">
    <template #header>
      <h3 class="text-2xl flex items-center gap-2">
        <base-ico class="text-skin-warning" name="expense"/>
        Expense: {{ model.name }}
      </h3>
    </template>

    <template #default>
      <n-alert v-if="Object.keys(apiErrors).length > 0" type="error" :title="errorMessage || 'An error occurred'" class="mb-4" />
      <n-form
          @submit.prevent
          ref="formRef"
          :model="model"
          :rules="rules"
          :label-placement="FORM_LABEL_PLACEMENT"
          :label-align="FORM_LABEL_ALIGN"
      >
        <n-form-item path="name" label="Name">
          <n-input v-model:value="model.name" placeholder="Enter expense name"/>
        </n-form-item>

        <n-form-item path="amount" label="Amount">
          <n-input-number v-model:value="model.amount" placeholder="Enter amount"/>
        </n-form-item>

        <n-form-item path="growth_rate" label="Growth Rate">
          <n-space vertical>
            <n-input-number v-model:value="model.growth_rate"
                            :disabled="model.grows_with_inflation"/>
          </n-space>
        </n-form-item>

        <n-form-item path="frequency" label="Frequency">
          <n-radio-group v-model:value="model.frequency">
            <n-radio-button v-for="option in [
              { label: 'Monthly', value: 'monthly' },
              { label: 'Weekly', value: 'weekly' },
              { label: 'Quarterly', value: 'quarterly' },
              { label: 'Annually', value: 'annual' }
            ]" :key="option.value" :label="option.label" :value="option.value"/>
          </n-radio-group>
        </n-form-item>

        <n-form-item path="expense_type" label="Expense Type">
          <n-radio-group v-model:value="model.expense_type">
            <n-radio-button v-for="option in [
                { label: 'Fixed', value: 'fixed' },
                { label: 'Variable', value: 'variable' }
              ]" :key="option.value" :label="option.label" :value="option.value"/>
          </n-radio-group>
        </n-form-item>

        <n-form-item class="justify-center" path="is_essential" label="Essential Expense">
          <n-switch v-model:value="model.is_essential"/>
        </n-form-item>

        <n-form-item path="is_tax_deductible" label="Tax Deductible">
          <n-switch v-model:value="model.is_tax_deductible" suffix="%"/>
        </n-form-item>

        <n-form-item path="grows_with_inflation" label="Grows With Inflation">
          <n-switch v-model:value="model.grows_with_inflation" suffix="%"/>
        </n-form-item>
      </n-form>
    </template>

    <template #footer>
      <base-stat class="text-end">
        <span class="text-skin-error">-${{
            $humanize.intComma(getAnnualAmount(model.amount ?? 0, model.frequency ?? 'annual'))
          }}/year</span>
      </base-stat>
    </template>

    <template #action>
      <FormActionButtons variant="update" @update="handleSubmit" @cancel="emit('cancel')" />
    </template>
  </n-card>
</template>
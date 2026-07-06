<script setup lang="ts">
import type {Expense, ExpenseInsert, ExpenseUpdate} from '#shared/types/Expense'
import type {ExpenseState} from '#shared/types/ExpenseState'
import type {CommandSequenceWithRelations} from '#shared/types/CommandSequence'
import {PREVIEW_TEMP_ID} from '~/stores/orchestratorStore'
import {expenseRules} from '~/utils/validators/expenseRules'
import {expenseDefaults} from '~/constants/ExpenseConstants'

type Props = {
  id: number | null
  planId: number | null
  commandSequence: CommandSequenceWithRelations | null
}
const {id, planId, commandSequence} = defineProps<Props>()

const emit = defineEmits<{
  preview: [states: ExpenseState[]]
  saved: []
  cancel: []
}>()

const store = useExpenseStore()
const commandSequenceStore = useCommandSequenceStore()
const orchestrator = orchestratorStore()

const model = ref<Partial<Expense>>({...expenseDefaults})
const isFetching = ref(false)
const nameInput = ref<{focus: () => void} | null>(null)

const FREQUENCY_OPTIONS = [
  {value: 'monthly', label: 'Monthly'},
  {value: 'weekly', label: 'Weekly'},
  {value: 'quarterly', label: 'Quarterly'},
  {value: 'annual', label: 'Annually'},
]

const EXPENSE_TYPE_OPTIONS = [
  {value: 'fixed', label: 'Fixed'},
  {value: 'variable', label: 'Variable'},
]

const {formRef, rules, onSubmit} = useNaiveForm(model)
rules.value = expenseRules(model).rules

onMounted(async () => {
  if (id !== null) {
    isFetching.value = true
    try {
      model.value = {...await store.fetch(id)}
    } finally {
      isFetching.value = false
    }
  }
  nextTick(() => nameInput.value?.focus())
  computePreview()
})

function computePreview() {
  if (!commandSequence) {
    emit('preview', [])
    return
  }
  const states = orchestrator.simulateEntityPreview(
      'expense',
      {...model.value, id: id ?? PREVIEW_TEMP_ID} as {id: number} & Record<string, unknown>,
      commandSequence
  ) as ExpenseState[] | null
  emit('preview', states ?? [])
}

let previewTimer: ReturnType<typeof setTimeout> | null = null
watch(model, () => {
  if (previewTimer) clearTimeout(previewTimer)
  previewTimer = setTimeout(computePreview, 300)
}, {deep: true})

function handleSubmit() {
  onSubmit(async () => {
    const {id: _id, ...rest} = model.value as Expense
    if (id === null) {
      await store.create({...rest, plan_id: planId} as ExpenseInsert)
      if (planId !== null) await commandSequenceStore.fetchByPlan(planId)
    } else {
      await store.patch(id, rest as ExpenseUpdate)
    }
    emit('saved')
  })
}
</script>

<template>
  <n-spin v-if="isFetching"/>
  <n-form v-else ref="formRef" :model="model" :rules="rules">
    <n-form-item label="Name" path="name" :show-feedback="false" class="!mb-3">
      <n-input ref="nameInput" v-model:value="model.name" placeholder="Enter expense name"/>
    </n-form-item>

    <n-form-item label="Amount" path="amount" :show-feedback="false" class="!mb-3">
      <base-number-slider v-model="model.amount" :min="0" :max="10000" :step="50"/>
    </n-form-item>

    <n-form-item label="Frequency" path="frequency" :show-feedback="false" class="!mb-3">
      <n-select v-model:value="model.frequency" :options="FREQUENCY_OPTIONS"/>
    </n-form-item>

    <n-form-item label="Expense type" path="expense_type" :show-feedback="false" class="!mb-3">
      <n-select v-model:value="model.expense_type" :options="EXPENSE_TYPE_OPTIONS"/>
    </n-form-item>

    <n-form-item label="Grows with inflation" path="grows_with_inflation" :show-feedback="false" class="!mb-3">
      <n-switch v-model:value="model.grows_with_inflation"/>
    </n-form-item>

    <n-form-item label="Growth rate (%)" path="growth_rate" :show-feedback="false" class="!mb-3">
      <base-number-slider v-model="model.growth_rate" :min="0" :max="15" :step="0.5"/>
    </n-form-item>

    <n-form-item label="Essential" path="is_essential" :show-feedback="false" class="!mb-3">
      <n-switch v-model:value="model.is_essential"/>
    </n-form-item>

    <n-form-item label="Tax deductible" path="is_tax_deductible" :show-feedback="false" class="!mb-3">
      <n-switch v-model:value="model.is_tax_deductible"/>
    </n-form-item>

    <n-form-item label="Retirement spending (%)" path="retirement_spending_percentage" :show-feedback="false" class="!mb-3">
      <base-number-slider v-model="model.retirement_spending_percentage" :min="0" :max="150" :step="5"/>
    </n-form-item>

    <n-form-item label="Retirement only" path="is_retirement_only" :show-feedback="false" class="!mb-3">
      <n-switch v-model:value="model.is_retirement_only"/>
    </n-form-item>

    <div class="flex justify-end gap-2 pt-4">
      <n-button quaternary @click="emit('cancel')">Cancel</n-button>
      <n-button type="primary" @click="handleSubmit">{{ id === null ? 'Create' : 'Save' }}</n-button>
    </div>
  </n-form>
</template>

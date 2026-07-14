<script setup lang="ts">
import type {RothIra, RothIraInsert, RothIraUpdate} from '#shared/types/RothIra'
import type {RothIraState} from '#shared/types/RothIraState'
import type {CommandSequenceWithRelations} from '#shared/types/CommandSequence'
import {PREVIEW_TEMP_ID} from '~/stores/orchestratorStore'
import {rothIraRules} from '~/utils/validators/rothIraRules'

type Props = {
  id: number | null
  planId: number | null
  commandSequence: CommandSequenceWithRelations | null
  initialValues?: Partial<RothIra>
}
const {id, planId, commandSequence, initialValues} = defineProps<Props>()

const emit = defineEmits<{
  preview: [states: RothIraState[]]
  saved: []
  cancel: []
}>()

const store = useRothIraStore()
const incomeStore = useIncomeStore()
const commandSequenceStore = useCommandSequenceStore()
const orchestrator = orchestratorStore()

const model = ref<Partial<RothIra>>({
  name: 'Roth IRA',
  initial_balance: 0,
  growth_rate: useDefaultGrowthRate(),
  contribution_strategy: 'fixed',
  contribution_fixed_amount: 0,
  contribution_percentage: 0,
  income_id: null,
  ...(id === null ? initialValues : undefined),
})
const isFetching = ref(false)
const nameInput = ref<{focus: () => void} | null>(null)

const STRATEGY_OPTIONS = [
  {value: 'fixed', label: 'Fixed', hint: 'A set amount each year'},
  {value: 'percentage_of_income', label: '% of Income', hint: 'A share of an income source'},
  {value: 'max', label: 'Max', hint: 'Contribute the IRS limit'},
]

const {formRef, rules, onSubmit} = useNaiveForm(model)
rules.value = rothIraRules(model).rules

onMounted(async () => {
  if (incomeStore.list.length === 0) await incomeStore.fetchAll()
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
      'roth_ira',
      {...model.value, id: id ?? PREVIEW_TEMP_ID} as {id: number} & Record<string, unknown>,
      commandSequence
  ) as RothIraState[] | null
  emit('preview', states ?? [])
}

let previewTimer: ReturnType<typeof setTimeout> | null = null
watch(model, () => {
  if (previewTimer) clearTimeout(previewTimer)
  previewTimer = setTimeout(computePreview, 300)
}, {deep: true})

function handleSubmit() {
  onSubmit(async () => {
    const {id: _id, ...rest} = model.value as RothIra
    if (id === null) {
      await store.create({...rest, plan_id: planId} as RothIraInsert)
      if (planId !== null) await commandSequenceStore.fetchByPlan(planId)
    } else {
      await store.patch(id, rest as RothIraUpdate)
    }
    emit('saved')
  })
}
</script>

<template>
  <n-spin v-if="isFetching"/>
  <n-form v-else ref="formRef" :model="model" :rules="rules">
    <n-form-item label="Name" path="name" :show-feedback="false" class="!mb-3">
      <n-input ref="nameInput" v-model:value="model.name" placeholder="Enter Roth IRA name"/>
    </n-form-item>

    <n-form-item label="Initial balance" path="initial_balance" :show-feedback="false" class="!mb-3">
      <n-input-number class="w-full" v-model:value="model.initial_balance" :step="1000" placeholder="Enter initial balance"/>
    </n-form-item>

    <n-form-item label="Growth rate (%)" path="growth_rate" :show-feedback="false" class="!mb-3">
      <base-number-slider v-model="model.growth_rate" :min="0" :max="15" :step="0.5"/>
    </n-form-item>

    <div class="text-sm font-medium text-skin-base mb-2">Contribution</div>
    <common-strategy-rows v-model="model.contribution_strategy" :options="STRATEGY_OPTIONS">
      <template #fixed>
        <n-form-item label="Amount / yr" path="contribution_fixed_amount" :show-feedback="false">
          <base-number-slider v-model="model.contribution_fixed_amount" :min="0" :max="8000" :step="100"/>
        </n-form-item>
      </template>
      <template #percentage_of_income>
        <n-form-item label="Percentage of income" path="contribution_percentage" :show-feedback="false" class="!mb-3">
          <base-number-slider v-model="model.contribution_percentage" :min="0" :max="50" :step="1"/>
        </n-form-item>
        <income-selector :incomes="incomeStore.list" v-model="model.income_id"/>
      </template>
    </common-strategy-rows>

    <div class="flex justify-end gap-2 pt-4">
      <n-button quaternary @click="emit('cancel')">Cancel</n-button>
      <n-button type="primary" @click="handleSubmit">{{ id === null ? 'Create' : 'Save' }}</n-button>
    </div>
  </n-form>
</template>

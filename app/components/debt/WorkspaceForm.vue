<script setup lang="ts">
import type {Debt, DebtInsert, DebtUpdate} from '#shared/types/Debt'
import type {DebtState} from '#shared/types/DebtState'
import type {CommandSequenceWithRelations} from '#shared/types/CommandSequence'
import type {Frequency} from '#shared/types/Frequency'
import {PREVIEW_TEMP_ID} from '~/stores/orchestratorStore'
import {debtRules} from '~/utils/validators/debtRules'

type Props = {
  id: number | null
  planId: number | null
  commandSequence: CommandSequenceWithRelations | null
}
const {id, planId, commandSequence} = defineProps<Props>()

const emit = defineEmits<{
  preview: [states: DebtState[]]
  saved: []
  cancel: []
}>()

const store = useDebtStore()
const commandSequenceStore = useCommandSequenceStore()
const orchestrator = orchestratorStore()

const model = ref<Partial<Debt>>({
  name: 'Debt',
  principal: 0,
  interest_rate: 6,
  frequency: 'monthly',
  payment_minimum: 0,
  payment_strategy: 'fixed',
  payment_fixed_amount: 0,
  payment_percentage: 0,
})
const isFetching = ref(false)
const nameInput = ref<{focus: () => void} | null>(null)

const STRATEGY_OPTIONS = [
  {value: 'fixed', label: 'Fixed', hint: 'A set amount each year'},
  {value: 'minimum_payment', label: 'Minimum payment', hint: 'Pay only the required minimum'},
  {value: 'maximum_payment', label: 'Maximum payment', hint: 'Throw everything you can at it'},
  {value: 'percentage_of_debt', label: '% of balance', hint: 'A share of what you still owe'},
]

const FREQUENCY_OPTIONS = [
  {label: 'Weekly', value: 'weekly' as Frequency},
  {label: 'Biweekly', value: 'biweekly' as Frequency},
  {label: 'Monthly', value: 'monthly' as Frequency},
  {label: 'Quarterly', value: 'quarterly' as Frequency},
  {label: 'Annual', value: 'annual' as Frequency},
]

const {formRef, rules, onSubmit} = useNaiveForm(model)
rules.value = debtRules(model).rules

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
      'debt',
      {...model.value, id: id ?? PREVIEW_TEMP_ID} as {id: number} & Record<string, unknown>,
      commandSequence
  ) as DebtState[] | null
  emit('preview', states ?? [])
}

let previewTimer: ReturnType<typeof setTimeout> | null = null
watch(model, () => {
  if (previewTimer) clearTimeout(previewTimer)
  previewTimer = setTimeout(computePreview, 300)
}, {deep: true})

function handleSubmit() {
  onSubmit(async () => {
    const {id: _id, ...rest} = model.value as Debt
    if (id === null) {
      await store.create({...rest, plan_id: planId} as DebtInsert)
      if (planId !== null) await commandSequenceStore.fetchByPlan(planId)
    } else {
      await store.patch(id, rest as DebtUpdate)
    }
    emit('saved')
  })
}
</script>

<template>
  <n-spin v-if="isFetching"/>
  <n-form v-else ref="formRef" :model="model" :rules="rules">
    <n-form-item label="Name" path="name" :show-feedback="false" class="!mb-3">
      <n-input ref="nameInput" v-model:value="model.name" placeholder="Enter debt name"/>
    </n-form-item>

    <n-form-item label="Balance owed" path="principal" :show-feedback="false" class="!mb-3">
      <n-input-number class="w-full" v-model:value="model.principal" :step="1000" placeholder="Enter balance owed"/>
    </n-form-item>

    <n-form-item label="Interest rate (%)" path="interest_rate" :show-feedback="false" class="!mb-3">
      <base-number-slider v-model="model.interest_rate" :min="0" :max="30" :step="0.5"/>
    </n-form-item>

    <n-form-item label="Payment frequency" path="frequency" :show-feedback="false" class="!mb-3">
      <n-select v-model:value="model.frequency" :options="FREQUENCY_OPTIONS"/>
    </n-form-item>

    <n-form-item label="Minimum payment" path="payment_minimum" :show-feedback="false" class="!mb-3">
      <base-number-slider v-model="model.payment_minimum" :min="0" :max="5000" :step="50"/>
    </n-form-item>

    <div class="text-sm font-medium text-skin-base mb-2">Payment strategy</div>
    <common-strategy-rows v-model="model.payment_strategy" :options="STRATEGY_OPTIONS">
      <template #fixed>
        <n-form-item label="Amount / yr" path="payment_fixed_amount" :show-feedback="false">
          <base-number-slider v-model="model.payment_fixed_amount" :min="0" :max="50000" :step="500"/>
        </n-form-item>
      </template>
      <template #percentage_of_debt>
        <n-form-item label="Percentage of balance" path="payment_percentage" :show-feedback="false">
          <base-number-slider v-model="model.payment_percentage" :min="0" :max="100" :step="1"/>
        </n-form-item>
      </template>
    </common-strategy-rows>

    <div class="flex justify-end gap-2 pt-4">
      <n-button quaternary @click="emit('cancel')">Cancel</n-button>
      <n-button type="primary" @click="handleSubmit">{{ id === null ? 'Create' : 'Save' }}</n-button>
    </div>
  </n-form>
</template>

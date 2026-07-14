<script setup lang="ts">
import type {TaxDeferred, TaxDeferredInsert, TaxDeferredUpdate} from '#shared/types/TaxDeferred'
import type {TaxDeferredState} from '#shared/types/TaxDeferredState'
import type {CommandSequenceWithRelations} from '#shared/types/CommandSequence'
import {PREVIEW_TEMP_ID} from '~/stores/orchestratorStore'
import {taxDeferredRules} from '~/utils/validators/taxDeferredRules'
import {taxDeferredDefaults} from '~/constants/TaxDeferredConstants'

type Props = {
  id: number | null
  planId: number | null
  commandSequence: CommandSequenceWithRelations | null
  initialValues?: Partial<TaxDeferred>
}
const {id, planId, commandSequence, initialValues} = defineProps<Props>()

const emit = defineEmits<{
  preview: [states: TaxDeferredState[]]
  saved: []
  cancel: []
}>()

const store = useTaxDeferredStore()
const commandSequenceStore = useCommandSequenceStore()
const incomeStore = useIncomeStore()
const orchestrator = orchestratorStore()

const model = ref<Partial<TaxDeferred>>({
  ...taxDeferredDefaults,
  growth_rate: useDefaultGrowthRate(),
  ...(id === null ? initialValues : undefined),
})
const isFetching = ref(false)
const nameInput = ref<{focus: () => void} | null>(null)

const ELECTIVE_OPTIONS = [
  {value: 'none', label: 'None', hint: 'Do not contribute'},
  {value: 'until_company_match', label: 'Up to employer match', hint: 'Contribute just enough to capture the full match'},
  {value: 'percentage_of_income', label: '% of income', hint: 'A share of one income'},
  {value: 'fixed', label: 'Fixed', hint: 'A set amount each year'},
  {value: 'max', label: 'Max', hint: 'Contribute the IRS limit'},
]

const EMPLOYER_OPTIONS = [
  {value: 'none', label: 'None', hint: 'No employer contribution'},
  {value: 'percentage_of_contribution', label: '% of your contribution', hint: 'Match a share of what you put in, up to a cap'},
  {value: 'percentage_of_compensation', label: '% of your pay', hint: 'A share of your salary'},
  {value: 'fixed', label: 'Fixed', hint: 'A set amount each year'},
]

const showIncome = computed(() => model.value.elective_contribution_strategy === 'percentage_of_income')

const {formRef, rules, onSubmit} = useNaiveForm(model)
rules.value = taxDeferredRules(model).rules

onMounted(async () => {
  if (id !== null) {
    isFetching.value = true
    try {
      model.value = {...await store.fetch(id)}
    } finally {
      isFetching.value = false
    }
  }
  incomeStore.fetchAll()
  nextTick(() => nameInput.value?.focus())
  computePreview()
})

function computePreview() {
  if (!commandSequence) {
    emit('preview', [])
    return
  }
  const states = orchestrator.simulateEntityPreview(
      'tax_deferred',
      {...model.value, id: id ?? PREVIEW_TEMP_ID} as {id: number} & Record<string, unknown>,
      commandSequence
  ) as TaxDeferredState[] | null
  emit('preview', states ?? [])
}

let previewTimer: ReturnType<typeof setTimeout> | null = null
watch(model, () => {
  if (previewTimer) clearTimeout(previewTimer)
  previewTimer = setTimeout(computePreview, 300)
}, {deep: true})

function handleSubmit() {
  onSubmit(async () => {
    const {id: _id, ...rest} = model.value as TaxDeferred
    if (id === null) {
      await store.create({...rest, plan_id: planId} as TaxDeferredInsert)
      if (planId !== null) await commandSequenceStore.fetchByPlan(planId)
    } else {
      await store.patch(id, rest as TaxDeferredUpdate)
    }
    emit('saved')
  })
}
</script>

<template>
  <n-spin v-if="isFetching"/>
  <n-form v-else ref="formRef" :model="model" :rules="rules">
    <n-form-item label="Name" path="name" :show-feedback="false" class="!mb-3">
      <n-input ref="nameInput" v-model:value="model.name" placeholder="Enter 401(k) name"/>
    </n-form-item>

    <n-form-item label="Initial balance" path="initial_balance" :show-feedback="false" class="!mb-3">
      <n-input-number class="w-full" v-model:value="model.initial_balance" :step="1000" placeholder="Enter initial balance"/>
    </n-form-item>

    <n-form-item label="Growth rate (%)" path="growth_rate" :show-feedback="false" class="!mb-3">
      <base-number-slider v-model="model.growth_rate" :min="0" :max="15" :step="0.5"/>
    </n-form-item>

    <div class="text-sm font-medium text-skin-base mb-2">Your contribution</div>
    <common-strategy-rows v-model="model.elective_contribution_strategy" :options="ELECTIVE_OPTIONS">
      <template #percentage_of_income>
        <n-form-item label="Percentage of income" path="elective_contribution_percentage" :show-feedback="false">
          <base-number-slider v-model="model.elective_contribution_percentage" :min="0" :max="50" :step="1"/>
        </n-form-item>
      </template>
      <template #fixed>
        <n-form-item label="Amount / yr" path="elective_contribution_fixed_amount" :show-feedback="false">
          <base-number-slider v-model="model.elective_contribution_fixed_amount" :min="0" :max="23500" :step="500"/>
        </n-form-item>
      </template>
    </common-strategy-rows>

    <div v-if="showIncome" class="mt-3">
      <div class="text-sm font-medium text-skin-base mb-2">Funded from income</div>
      <n-form-item path="income_id" :show-label="false">
        <income-selector :incomes="incomeStore.list" v-model="model.income_id"/>
      </n-form-item>
    </div>

    <div class="flex items-center justify-between mt-5 mb-2">
      <span class="text-sm font-medium text-skin-base">Employer match</span>
      <n-switch v-model:value="model.employer_contributes"/>
    </div>
    <common-strategy-rows
        v-if="model.employer_contributes"
        v-model="model.employer_contribution_strategy"
        :options="EMPLOYER_OPTIONS"
    >
      <template #percentage_of_contribution>
        <div class="grid grid-cols-2 gap-3">
          <n-form-item label="Match (%)" path="employer_match_percentage" :show-feedback="false">
            <base-number-slider v-model="model.employer_match_percentage" :min="0" :max="100" :step="5"/>
          </n-form-item>
          <n-form-item label="Up to (% of pay)" path="employer_match_percentage_limit" :show-feedback="false">
            <base-number-slider v-model="model.employer_match_percentage_limit" :min="0" :max="25" :step="1"/>
          </n-form-item>
        </div>
      </template>
      <template #percentage_of_compensation>
        <n-form-item label="Percentage of pay" path="employer_compensation_match_percentage" :show-feedback="false">
          <base-number-slider v-model="model.employer_compensation_match_percentage" :min="0" :max="25" :step="1"/>
        </n-form-item>
      </template>
      <template #fixed>
        <n-form-item label="Amount / yr" path="employer_contribution_fixed_amount" :show-feedback="false">
          <base-number-slider v-model="model.employer_contribution_fixed_amount" :min="0" :max="20000" :step="500"/>
        </n-form-item>
      </template>
    </common-strategy-rows>

    <div class="flex justify-end gap-2 pt-4">
      <n-button quaternary @click="emit('cancel')">Cancel</n-button>
      <n-button type="primary" @click="handleSubmit">{{ id === null ? 'Create' : 'Save' }}</n-button>
    </div>
  </n-form>
</template>

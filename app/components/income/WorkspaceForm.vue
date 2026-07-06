<script setup lang="ts">
import type {Income, IncomeInsert, IncomeUpdate} from '#shared/types/Income'
import type {IncomeState} from '#shared/types/IncomeState'
import type {CommandSequenceWithRelations} from '#shared/types/CommandSequence'
import type {ModelName} from '#shared/types/ModelName'
import {PREVIEW_TEMP_ID} from '~/stores/orchestratorStore'
import {incomeRules} from '~/utils/validators/incomeRules'
import {incomeDefaults} from '~/constants/IncomeConstants'
import {iraDefaults} from '~/constants/IraConstants'
import {rothIraDefaults} from '~/constants/RothIraConstants'
import {taxDeferredDefaults} from '~/constants/TaxDeferredConstants'

type Props = {
  id: number | null
  planId: number | null
  commandSequence: CommandSequenceWithRelations | null
}
const {id, planId, commandSequence} = defineProps<Props>()

const emit = defineEmits<{
  preview: [states: IncomeState[]]
  saved: []
  cancel: []
}>()

const store = useIncomeStore()
const commandSequenceStore = useCommandSequenceStore()
const orchestrator = orchestratorStore()
const workspace = useWorkspaceStore()
const iraStore = useIraStore()
const rothIraStore = useRothIraStore()
const taxDeferredStore = useTaxDeferredStore()

const model = ref<Partial<Income>>({...incomeDefaults})
const isFetching = ref(false)
const nameInput = ref<{focus: () => void} | null>(null)

const FREQUENCY_OPTIONS = [
  {label: 'Weekly', value: 'weekly'},
  {label: 'Biweekly', value: 'biweekly'},
  {label: 'Monthly', value: 'monthly'},
  {label: 'Quarterly', value: 'quarterly'},
  {label: 'Annual', value: 'annual'},
]

const {formRef, rules, onSubmit} = useNaiveForm(model)
rules.value = incomeRules(model).rules

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
      'income',
      {...model.value, id: id ?? PREVIEW_TEMP_ID} as {id: number} & Record<string, unknown>,
      commandSequence
  ) as IncomeState[] | null
  emit('preview', states ?? [])
}

let previewTimer: ReturnType<typeof setTimeout> | null = null
watch(model, () => {
  if (previewTimer) clearTimeout(previewTimer)
  previewTimer = setTimeout(computePreview, 300)
}, {deep: true})

// One entity, two views: accounts funded as % of THIS income (income_id === id).
type LinkedAccount = {modelName: ModelName; id: number; name: string; typeLabel: string}
const linkedAccounts = computed<LinkedAccount[]>(() => {
  if (id === null) return []
  const out: LinkedAccount[] = []
  for (const account of iraStore.list) if (account.income_id === id) out.push({modelName: 'ira', id: account.id, name: account.name, typeLabel: 'IRA'})
  for (const account of rothIraStore.list) if (account.income_id === id) out.push({modelName: 'roth_ira', id: account.id, name: account.name, typeLabel: 'Roth'})
  for (const account of taxDeferredStore.list) if (account.income_id === id) out.push({modelName: 'tax_deferred', id: account.id, name: account.name, typeLabel: '401k'})
  return out
})

const QUICK_TYPES = [
  {label: '401(k)', value: 'tax_deferred'},
  {label: 'IRA', value: 'ira'},
  {label: 'Roth', value: 'roth_ira'},
]
const quickType = ref<'tax_deferred' | 'ira' | 'roth_ira'>('tax_deferred')
const quickPercentage = ref<number>(6)
const adding = ref(false)

async function addLinked() {
  const forPlanId = model.value.plan_id ?? planId
  if (id === null || forPlanId == null) return
  adding.value = true
  try {
    if (quickType.value === 'ira') {
      await iraStore.create({...iraDefaults, plan_id: forPlanId, income_id: id, contribution_strategy: 'percentage_of_income', contribution_percentage: quickPercentage.value})
    } else if (quickType.value === 'roth_ira') {
      await rothIraStore.create({...rothIraDefaults, plan_id: forPlanId, income_id: id, contribution_strategy: 'percentage_of_income', contribution_percentage: quickPercentage.value})
    } else {
      await taxDeferredStore.create({...taxDeferredDefaults, plan_id: forPlanId, income_id: id, elective_contribution_strategy: 'percentage_of_income', elective_contribution_percentage: quickPercentage.value})
    }
    await commandSequenceStore.fetchByPlan(forPlanId)
  } finally {
    adding.value = false
  }
}

function handleSubmit() {
  onSubmit(async () => {
    const {id: _id, ...rest} = model.value as Income
    if (id === null) {
      await store.create({...rest, plan_id: planId} as IncomeInsert)
      if (planId !== null) await commandSequenceStore.fetchByPlan(planId)
    } else {
      await store.patch(id, rest as IncomeUpdate)
    }
    emit('saved')
  })
}
</script>

<template>
  <n-spin v-if="isFetching"/>
  <n-form v-else ref="formRef" :model="model" :rules="rules">
    <n-form-item label="Name" path="name" :show-feedback="false" class="!mb-3">
      <n-input ref="nameInput" v-model:value="model.name" placeholder="Employer or source"/>
    </n-form-item>

    <n-form-item label="Gross income" path="gross_income" :show-feedback="false" class="!mb-3">
      <n-input-number class="w-full" v-model:value="model.gross_income" :step="1000" placeholder="Gross income"/>
    </n-form-item>

    <n-form-item label="Frequency" path="frequency" :show-feedback="false" class="!mb-3">
      <n-select v-model:value="model.frequency" :options="FREQUENCY_OPTIONS" class="w-full"/>
    </n-form-item>

    <n-form-item label="Growth rate (%)" path="growth_rate" :show-feedback="false" class="!mb-4">
      <base-number-slider v-model="model.growth_rate" :min="0" :max="15" :step="0.5"/>
    </n-form-item>

    <div v-if="id !== null" class="border-t border-skin-base pt-3">
      <div class="text-sm font-medium text-skin-base mb-2">Investments linked to this income</div>
      <div v-if="linkedAccounts.length" class="rounded-lg border border-skin-base divide-y divide-skin-base overflow-hidden mb-2">
        <button
            v-for="account in linkedAccounts"
            :key="account.modelName + account.id"
            type="button"
            class="w-full flex items-center justify-between p-2.5 text-left hover:bg-skin-surface-hover"
            @click="workspace.open(account.modelName, account.id)"
        >
          <span class="flex items-center gap-2 min-w-0">
            <n-tag size="small" round>{{ account.typeLabel }}</n-tag>
            <span class="text-sm text-skin-base truncate">{{ account.name }}</span>
          </span>
          <base-ico name="edit" class="text-skin-muted shrink-0"/>
        </button>
      </div>
      <p v-else class="text-xs text-skin-muted mb-2">No investments funded by this income yet.</p>
      <div class="rounded-lg border border-skin-base p-2.5 space-y-2">
        <div class="text-xs text-skin-muted">Fund a new investment from this income</div>
        <div class="flex items-center gap-2">
          <n-select v-model:value="quickType" :options="QUICK_TYPES" size="small" class="w-28 shrink-0"/>
          <n-input-number v-model:value="quickPercentage" size="small" :min="0" :max="100" class="flex-1">
            <template #suffix>% of income</template>
          </n-input-number>
          <n-button size="small" type="primary" :loading="adding" @click="addLinked">Add</n-button>
        </div>
      </div>
    </div>

    <div class="flex justify-end gap-2 pt-4">
      <n-button quaternary @click="emit('cancel')">Cancel</n-button>
      <n-button type="primary" @click="handleSubmit">{{ id === null ? 'Create' : 'Save' }}</n-button>
    </div>
  </n-form>
</template>

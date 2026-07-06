<script setup lang="ts">
import type {Income, IncomeInsert, IncomeUpdate} from '#shared/types/Income'
import type {IncomeState} from '#shared/types/IncomeState'
import type {CommandSequenceWithRelations} from '#shared/types/CommandSequence'
import type {ModelName} from '#shared/types/ModelName'
import {PREVIEW_TEMP_ID} from '~/stores/orchestratorStore'
import {incomeRules} from '~/utils/validators/incomeRules'
import {incomeDefaults} from '~/constants/IncomeConstants'
import IraWorkspaceForm from '~/components/ira/WorkspaceForm.vue'
import RothIraWorkspaceForm from '~/components/rothIra/WorkspaceForm.vue'
import TaxDeferredWorkspaceForm from '~/components/taxDeferred/WorkspaceForm.vue'

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
const savedIncomeId = ref<number | null>(id)
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
      {...model.value, id: savedIncomeId.value ?? PREVIEW_TEMP_ID} as {id: number} & Record<string, unknown>,
      commandSequence
  ) as IncomeState[] | null
  emit('preview', states ?? [])
}

let previewTimer: ReturnType<typeof setTimeout> | null = null
watch(model, () => {
  if (previewTimer) clearTimeout(previewTimer)
  previewTimer = setTimeout(computePreview, 300)
}, {deep: true})

const linkPlanId = computed(() => model.value.plan_id ?? planId)

// One entity, two views: accounts funded from THIS income (income_id === savedIncomeId).
type LinkedAccount = {modelName: ModelName; id: number; name: string; typeLabel: string}
const linkedAccounts = computed<LinkedAccount[]>(() => {
  const linkedId = savedIncomeId.value
  if (linkedId === null) return []
  const out: LinkedAccount[] = []
  for (const account of taxDeferredStore.list) if (account.income_id === linkedId) out.push({modelName: 'tax_deferred', id: account.id, name: account.name, typeLabel: '401(k)'})
  for (const account of iraStore.list) if (account.income_id === linkedId) out.push({modelName: 'ira', id: account.id, name: account.name, typeLabel: 'IRA'})
  for (const account of rothIraStore.list) if (account.income_id === linkedId) out.push({modelName: 'roth_ira', id: account.id, name: account.name, typeLabel: 'Roth'})
  return out
})

// Persist the income (create in create-mode, patch in edit-mode) so linked accounts have a
// real income_id to point at. Returns the income id, or null if not yet valid.
async function ensureSaved(): Promise<number | null> {
  const {id: _id, ...rest} = model.value as Income
  if (savedIncomeId.value !== null) {
    await store.patch(savedIncomeId.value, rest as IncomeUpdate)
    return savedIncomeId.value
  }
  const created = await store.create({...rest, plan_id: planId} as IncomeInsert)
  if (planId !== null) await commandSequenceStore.fetchByPlan(planId)
  savedIncomeId.value = created.id
  return created.id
}

type LinkType = 'tax_deferred' | 'ira' | 'roth_ira'
const ADD_TYPES: {label: string; value: LinkType}[] = [
  {label: '＋ 401(k)', value: 'tax_deferred'},
  {label: '＋ IRA', value: 'ira'},
  {label: '＋ Roth', value: 'roth_ira'},
]
const linkingType = ref<LinkType | null>(null)

const linkingComponent = computed(() => {
  switch (linkingType.value) {
    case 'ira':
      return IraWorkspaceForm
    case 'roth_ira':
      return RothIraWorkspaceForm
    case 'tax_deferred':
      return TaxDeferredWorkspaceForm
    default:
      return null
  }
})

const linkingInitialValues = computed<Record<string, unknown>>(() => {
  const base = {income_id: savedIncomeId.value}
  return linkingType.value === 'tax_deferred'
      ? {...base, elective_contribution_strategy: 'percentage_of_income'}
      : {...base, contribution_strategy: 'percentage_of_income'}
})

function startLink(type: LinkType) {
  onSubmit(async () => {
    await ensureSaved()
    linkingType.value = type
  })
}

function onLinkedSaved() {
  linkingType.value = null
}

function handleSubmit() {
  onSubmit(async () => {
    await ensureSaved()
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

    <div class="border-t border-skin-base pt-3">
      <div class="text-sm font-medium text-skin-base mb-2">Investments funded by this income</div>

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

      <!-- Reuse the real account form inline, pre-linked to this income. -->
      <div v-if="linkingType" class="rounded-lg border border-skin-info p-3 mb-2">
        <div class="text-xs text-skin-muted mb-2">New investment funded by {{ model.name || 'this income' }}</div>
        <component
            :is="linkingComponent"
            :id="null"
            :plan-id="linkPlanId"
            :command-sequence="commandSequence"
            :initial-values="linkingInitialValues"
            @saved="onLinkedSaved"
            @cancel="linkingType = null"
        />
      </div>
      <div v-else class="flex flex-wrap items-center gap-2">
        <n-button
            v-for="item in ADD_TYPES"
            :key="item.value"
            size="small"
            secondary
            round
            @click="startLink(item.value)"
        >
          {{ item.label }}
        </n-button>
      </div>
    </div>

    <div v-if="!linkingType" class="flex justify-end gap-2 pt-4">
      <n-button quaternary @click="emit('cancel')">Cancel</n-button>
      <n-button type="primary" @click="handleSubmit">{{ savedIncomeId === null ? 'Create' : 'Save' }}</n-button>
    </div>
  </n-form>
</template>

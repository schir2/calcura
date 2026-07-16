<script setup lang="ts">
import type {CashReserve, CashReserveInsert, CashReserveUpdate, CashReserveTemplate} from '#shared/types/CashReserve'
import type {CashReserveState} from '#shared/types/CashReserveState'
import type {CommandSequenceWithRelations} from '#shared/types/CommandSequence'
import {PREVIEW_TEMP_ID} from '~/stores/orchestratorStore'
import {cashReserveRules} from '~/utils/validators/cashReserveRules'
import {cashReserveDefaults} from '~/constants/CashReserveConstants'
import {processTemplate} from '~/utils/templateProcessorUtils'

type Props = {
  id: number | null
  planId: number | null
  commandSequence: CommandSequenceWithRelations | null
  initialValues?: Partial<CashReserve> | null
}
const {id, planId, commandSequence, initialValues} = defineProps<Props>()

const emit = defineEmits<{
  preview: [states: CashReserveState[]]
  saved: []
  cancel: []
}>()

const store = useCashReserveStore()
const templateStore = useCashReserveTemplateStore()
const commandSequenceStore = useCommandSequenceStore()
const orchestrator = orchestratorStore()

const createDefaults: Partial<CashReserve> = {...cashReserveDefaults}

const model = ref<Partial<CashReserve>>({
  ...createDefaults,
  ...(id === null ? initialValues : undefined),
})
const selectedTemplateId = ref<number | null>(null)
const isFetching = ref(false)
const nameInput = ref<{focus: () => void} | null>(null)

const STRATEGY_OPTIONS = [
  {value: 'fixed', label: 'Fixed', hint: 'Hold a set dollar buffer'},
  {value: 'variable', label: 'Variable', hint: 'Hold N months of expenses'},
]

const {formRef, rules, onSubmit} = useNaiveForm(model)
rules.value = cashReserveRules(model).rules

onMounted(async () => {
  if (id === null) {
    if (!templateStore.list.length) templateStore.fetchAll()
  } else {
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

const templateOptions = computed(() =>
    templateStore.list.map((template: CashReserveTemplate) => ({label: template.name, value: template.id})))

function applyTemplate(templateId: number | null) {
  const template = templateId === null ? null : templateStore.get(templateId)
  model.value = template
      ? (processTemplate(createDefaults, template) as Partial<CashReserve>)
      : {...createDefaults}
}

function computePreview() {
  if (!commandSequence) {
    emit('preview', [])
    return
  }
  const states = orchestrator.simulateEntityPreview(
      'cash_reserve',
      {...model.value, id: id ?? PREVIEW_TEMP_ID} as {id: number} & Record<string, unknown>,
      commandSequence
  ) as CashReserveState[] | null
  emit('preview', states ?? [])
}

let previewTimer: ReturnType<typeof setTimeout> | null = null
watch(model, () => {
  if (previewTimer) clearTimeout(previewTimer)
  previewTimer = setTimeout(computePreview, 300)
}, {deep: true})

function handleSubmit() {
  onSubmit(async () => {
    const {id: _id, ...rest} = model.value as CashReserve
    if (id === null) {
      await store.create({...rest, plan_id: planId} as CashReserveInsert)
      if (planId !== null) await commandSequenceStore.fetchByPlan(planId)
    } else {
      await store.patch(id, rest as CashReserveUpdate)
    }
    emit('saved')
  })
}
</script>

<template>
  <n-spin v-if="isFetching"/>
  <n-form v-else ref="formRef" :model="model" :rules="rules">
    <n-form-item v-if="id === null && templateOptions.length" label="Start from a template" :show-feedback="false" class="!mb-3">
      <n-select
          v-model:value="selectedTemplateId"
          :options="templateOptions"
          placeholder="Choose a template"
          clearable
          @update:value="applyTemplate"
      />
    </n-form-item>

    <n-form-item label="Name" path="name" :show-feedback="false" class="!mb-3">
      <n-input ref="nameInput" v-model:value="model.name" placeholder="eg: Emergency Funds"/>
    </n-form-item>

    <n-form-item label="Initial amount" path="initial_amount" :show-feedback="false" class="!mb-3">
      <n-input-number class="w-full" v-model:value="model.initial_amount" :step="1000" placeholder="Enter initial amount"/>
    </n-form-item>

    <div class="text-sm font-medium text-skin-base mb-2">Reserve strategy</div>
    <common-strategy-rows v-model="model.cash_reserve_strategy" :options="STRATEGY_OPTIONS">
      <template #fixed>
        <n-form-item label="Reserve amount" path="reserve_amount" :show-feedback="false">
          <base-number-slider v-model="model.reserve_amount" :min="0" :max="100000" :step="1000"/>
        </n-form-item>
      </template>
      <template #variable>
        <n-form-item label="Months of expenses" path="reserve_months" :show-feedback="false">
          <base-number-slider v-model="model.reserve_months" :min="0" :max="24" :step="1"/>
        </n-form-item>
      </template>
    </common-strategy-rows>

    <div class="flex justify-end gap-2 pt-4">
      <n-button quaternary @click="emit('cancel')">Cancel</n-button>
      <n-button type="primary" @click="handleSubmit">{{ id === null ? 'Create' : 'Save' }}</n-button>
    </div>
  </n-form>
</template>

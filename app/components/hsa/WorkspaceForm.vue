<script setup lang="ts">
import type {Hsa, HsaInsert, HsaUpdate} from '#shared/types/Hsa'
import type {HsaState} from '#shared/types/HsaState'
import type {CommandSequenceWithRelations} from '#shared/types/CommandSequence'
import {PREVIEW_TEMP_ID} from '~/stores/orchestratorStore'
import {hsaRules} from '~/utils/validators/hsaRules'

type Props = {
  id: number | null
  planId: number | null
  commandSequence: CommandSequenceWithRelations | null
}
const {id, planId, commandSequence} = defineProps<Props>()

const emit = defineEmits<{
  preview: [states: HsaState[]]
  saved: []
  cancel: []
}>()

const store = useHsaStore()
const commandSequenceStore = useCommandSequenceStore()
const orchestrator = orchestratorStore()

const model = ref<Partial<Hsa>>({
  name: 'HSA',
  initial_balance: 0,
  growth_rate: useDefaultGrowthRate(),
  contribution_strategy: 'fixed',
  contribution_fixed_amount: 0,
})
const isFetching = ref(false)
const nameInput = ref<{focus: () => void} | null>(null)

const STRATEGY_OPTIONS = [
  {value: 'fixed', label: 'Fixed', hint: 'A set amount each year'},
  {value: 'max', label: 'Max', hint: 'Contribute the IRS limit'},
]

const {formRef, rules, onSubmit} = useNaiveForm(model)
rules.value = hsaRules(model).rules

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
      'hsa',
      {...model.value, id: id ?? PREVIEW_TEMP_ID} as {id: number} & Record<string, unknown>,
      commandSequence
  ) as HsaState[] | null
  emit('preview', states ?? [])
}

let previewTimer: ReturnType<typeof setTimeout> | null = null
watch(model, () => {
  if (previewTimer) clearTimeout(previewTimer)
  previewTimer = setTimeout(computePreview, 300)
}, {deep: true})

function handleSubmit() {
  onSubmit(async () => {
    const {id: _id, ...rest} = model.value as Hsa
    if (id === null) {
      await store.create({...rest, plan_id: planId} as HsaInsert)
      if (planId !== null) await commandSequenceStore.fetchByPlan(planId)
    } else {
      await store.patch(id, rest as HsaUpdate)
    }
    emit('saved')
  })
}
</script>

<template>
  <n-spin v-if="isFetching"/>
  <n-form v-else ref="formRef" :model="model" :rules="rules">
    <n-form-item label="Name" path="name" :show-feedback="false" class="!mb-3">
      <n-input ref="nameInput" v-model:value="model.name" placeholder="Enter HSA name"/>
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
          <base-number-slider v-model="model.contribution_fixed_amount" :min="0" :max="8300" :step="100"/>
        </n-form-item>
      </template>
    </common-strategy-rows>

    <div class="flex justify-end gap-2 pt-4">
      <n-button quaternary @click="emit('cancel')">Cancel</n-button>
      <n-button type="primary" @click="handleSubmit">{{ id === null ? 'Create' : 'Save' }}</n-button>
    </div>
  </n-form>
</template>

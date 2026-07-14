<script lang="ts" setup>
import type {Plan, PlanUpdate} from '#shared/types/Plan'
import type {OrchestratorState} from '#shared/types/OrchestratorState'
import type {CommandSequenceWithRelations} from '#shared/types/CommandSequence'
import type {PlanWorkspaceTab} from '~/stores/workspaceStore'
import {planRules} from '~/utils/validators/planRules'
import PlanFieldsRates from '~/components/plan/fields/Rates.vue'
import PlanFieldsGoal from '~/components/plan/fields/Goal.vue'
import PlanFieldsTimeline from '~/components/plan/fields/Timeline.vue'

type Props = {
  id: number
  commandSequence: CommandSequenceWithRelations | null
  initialTab?: PlanWorkspaceTab
}
const {id, commandSequence, initialTab = 'rates'} = defineProps<Props>()

// Emits the edited config alongside the states: the verdict is derived from the plan's strategy
// fields, so the projection needs the in-flight edits, not the saved row.
const emit = defineEmits<{
  preview: [payload: {states: OrchestratorState[]; plan: Partial<Plan>}]
  saved: []
  cancel: []
}>()

const store = usePlanStore()
const orchestrator = orchestratorStore()

const model = ref<Partial<Plan>>({})
const isFetching = ref(true)
const tab = ref<PlanWorkspaceTab>(initialTab)

const {formRef, rules, onSubmit} = useNaiveForm(model)
rules.value = planRules(model).rules

onMounted(async () => {
  try {
    model.value = {...await store.fetch(id)}
  } finally {
    isFetching.value = false
  }
  computePreview()
})

function computePreview() {
  if (!commandSequence || isFetching.value) {
    emit('preview', {states: [], plan: model.value})
    return
  }
  emit('preview', {
    states: orchestrator.simulatePlanPreview(model.value, commandSequence) ?? [],
    plan: model.value,
  })
}

let previewTimer: ReturnType<typeof setTimeout> | null = null
watch(model, () => {
  if (previewTimer) clearTimeout(previewTimer)
  previewTimer = setTimeout(computePreview, 300)
}, {deep: true})

function handleSubmit() {
  onSubmit(async () => {
    const {id: _id, ...update} = model.value as Plan
    await store.patch(id, update as PlanUpdate)
    await orchestrator.reloadPlan(id)
    emit('saved')
  })
}
</script>

<template>
  <n-spin v-if="isFetching"/>
  <n-form v-else ref="formRef" :model="model" :rules="rules">
    <n-tabs v-model:value="tab" type="segment" size="small" class="mb-4">
      <n-tab name="rates">Rates</n-tab>
      <n-tab name="goal">Goal</n-tab>
      <n-tab name="timeline">Timeline</n-tab>
    </n-tabs>

    <PlanFieldsRates v-if="tab === 'rates'" v-model="model"/>
    <PlanFieldsGoal v-else-if="tab === 'goal'" v-model="model"/>
    <PlanFieldsTimeline v-else v-model="model"/>

    <div class="flex justify-end gap-2 pt-4">
      <n-button quaternary @click="emit('cancel')">Cancel</n-button>
      <n-button type="primary" @click="handleSubmit">Save</n-button>
    </div>
  </n-form>
</template>

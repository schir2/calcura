<script setup lang="ts">
import type {OrchestratorState} from '#shared/types/OrchestratorState'
import type {PlanWithRelations} from '#shared/types/Plan'
import NetWorthSpine from '~/components/plan/chart/NetWorthSpine.vue'
import {buildVerdict} from '~/components/plan/overview/verdict'
import {netWorthAt} from '~/components/plan/overview/stats'

// The plan has no balance of its own, so its projection IS the verdict + the whole trajectory
// (ADR 015). `plan` must be the *edited* config — buildVerdict reads retirement_strategy,
// retirement_age and retirement_savings_amount off it, so a saved-config verdict would not move.
const props = defineProps<{
  states: OrchestratorState[]
  baselineStates: OrchestratorState[]
  plan: PlanWithRelations | null
}>()

const verdict = computed(() =>
    props.plan && props.states.length ? buildVerdict(props.states, props.plan) : null)

// Reference point per #107: the *edited* plan's retirement year, falling back to end-of-plan
// when these edits never retire.
const reference = computed(() => {
  const retireIndex = props.states.findIndex(s => s.retired)
  return retireIndex >= 0
      ? {index: retireIndex, label: 'at retirement'}
      : {index: props.states.length - 1, label: 'by end of plan'}
})

const delta = computed(() => {
  const {index} = reference.value
  const edited = props.states[index]
  const baseline = props.baselineStates[index]
  if (!edited || !baseline) return null
  return netWorthAt(edited) - netWorthAt(baseline)
})
</script>

<template>
  <div class="space-y-4">
    <div v-if="verdict" class="rounded-lg border border-skin-base p-4">
      <div :class="['text-2xl font-bold leading-none', verdict.onTrack ? 'text-skin-success' : 'text-skin-error']">
        {{ verdict.onTrack ? 'On track' : 'Off track' }}
      </div>
      <p class="mt-2 text-sm text-skin-base">{{ verdict.headline }}</p>

      <div v-if="verdict.failure" class="mt-2 text-xs text-skin-muted">
        <div>{{ verdict.failure.gap }}</div>
        <div>{{ verdict.failure.lever }}</div>
      </div>

      <n-tag
          v-if="delta !== null && Math.round(delta) !== 0"
          size="small"
          class="mt-3"
          :type="delta > 0 ? 'success' : 'error'">
        {{ delta > 0 ? '+' : '−' }}{{ fmtUsd(Math.abs(delta)) }} {{ reference.label }}
      </n-tag>
    </div>

    <NetWorthSpine v-if="states.length" :states="states" :baseline-states="baselineStates" :height="260"/>
    <p v-else class="text-sm text-skin-muted">No projection yet.</p>

    <div class="rounded border border-dashed border-skin-base p-3 text-xs text-skin-muted">
      <div class="flex items-center gap-1 font-medium">
        <base-ico name="info"/>
        About your plan
      </div>
      <p class="mt-1">
        These settings apply to the whole plan. The dashed line is your saved plan — the solid one
        is what these edits would do. (Guidance coming soon.)
      </p>
    </div>
  </div>
</template>

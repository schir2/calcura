<script setup lang="ts">
// Strategy-aware verdict hero crowning the Overview (#97). Split card: left = ON/OFF TRACK status +
// strategy headline + (on failure) the honest gap/lever box; right = 2x2 strategy-adaptive KPI grid.
// Failure keeps the strategy's KPIs and only recolors — no shortfall-KPI swap (design locked on #97).
import type {OrchestratorState} from '#shared/types/OrchestratorState'
import type {PlanWithRelations} from '#shared/types/Plan'
import {buildVerdict, type VerdictTone} from './verdict'

const props = defineProps<{ states: OrchestratorState[]; plan: PlanWithRelations }>()
const verdict = computed(() => buildVerdict(props.states, props.plan))

const toneClass: Record<VerdictTone, string> = {
  base: 'text-skin-base',
  success: 'text-skin-success',
  error: 'text-skin-error',
  info: 'text-skin-info',
}
</script>

<template>
  <n-card :class="verdict.onTrack ? '' : 'border-skin-error/50'">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div :class="['lg:border-r lg:pr-6', verdict.onTrack ? 'border-skin-base' : 'border-skin-error/30']">
        <div :class="['text-4xl sm:text-5xl font-bold tracking-tight leading-none',
          verdict.onTrack ? 'text-skin-success' : 'text-skin-error']">
          {{ verdict.onTrack ? 'On Track' : 'Off Track' }}
        </div>
        <h2 class="text-2xl font-semibold mt-3">{{ verdict.headline }}</h2>

        <div v-if="verdict.failure"
             class="mt-4 rounded-lg bg-skin-error/10 border border-skin-error/40 px-4 py-3">
          <div class="text-sm text-skin-secondary">
            You're <b class="text-skin-error">{{ verdict.failure.gap }}</b> short of your goal.
          </div>
          <div class="text-sm font-medium mt-1.5">{{ verdict.failure.lever }}</div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 content-center">
        <div v-for="k in verdict.kpis" :key="k.label">
          <div class="text-[11px] uppercase tracking-wide text-skin-muted">{{ k.label }}</div>
          <div :class="['text-2xl font-bold tabular-nums', toneClass[k.tone ?? 'base']]">{{ k.value }}</div>
          <div v-if="k.hint" class="text-[11px] text-skin-muted">{{ k.hint }}</div>
        </div>
      </div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
// PROTOTYPE — issue #94. Overview composition (locked to the master-aligned layout).
// Delete this whole folder (and its mount in pages/plans/[id].vue) once folded into production.
import type {OrchestratorState} from '#shared/types/OrchestratorState'
import type {PlanWithRelations} from '#shared/types/Plan'
import type {ModelName} from '#shared/types/ModelName'
import VariantA from './VariantA.vue'

defineProps<{ states: OrchestratorState[]; plan?: PlanWithRelations | null }>()
const emit = defineEmits<{ 'create-model': [payload: { model: ModelName, data: unknown }] }>()
</script>

<template>
  <VariantA :states="states" :plan="plan" @create-model="emit('create-model', $event)"/>
</template>

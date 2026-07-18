<script setup lang="ts">
import type {CommandSequenceWithRelations} from "#shared/types/CommandSequence";
import type {CommandSequenceCommandWithRelations} from "#shared/types/CommandSequenceCommand";
import type {PlanWithRelations} from "#shared/types/Plan";
import type {ModelName} from "#shared/types/ModelName";
import {predefinedOrderRank, predefinedWithdrawalRank} from "~/constants/CommandOrder";

type Props = {
  commandSequence: CommandSequenceWithRelations,
  plan: PlanWithRelations,
}

const props = defineProps<Props>()
const commandSequenceStore = useCommandSequenceStore()

const emit = defineEmits<{
  update: [payload: { modelName: ModelName, id: number, data: Record<string, unknown> }]
  delete: [payload: { modelName: ModelName, id: number }]
}>()

// The command list splits by action into two independently-ordered lists: contributions (process +
// invest) and withdrawals (withdraw). One visible at a time behind a segmented switch (#81).
const view = ref<'contributions' | 'withdrawals'>('contributions')

const accumulationLocked = computed(() => props.commandSequence.accumulation_ordering_type === 'predefined')
const withdrawalLocked = computed(() => props.commandSequence.withdrawal_ordering_type === 'predefined')

const accumulationCommands = computed<CommandSequenceCommandWithRelations[]>(() => {
  const list = props.commandSequence.command_sequence_commands.filter(csc => csc.command.action !== 'withdraw')
  return accumulationLocked.value
      ? [...list].sort((a, b) => predefinedOrderRank(a.command.model_name) - predefinedOrderRank(b.command.model_name))
      : list
})

const withdrawalCommands = computed<CommandSequenceCommandWithRelations[]>(() => {
  const list = props.commandSequence.command_sequence_commands.filter(csc => csc.command.action === 'withdraw')
  return withdrawalLocked.value
      ? [...list].sort((a, b) => predefinedWithdrawalRank(a.command.model_name) - predefinedWithdrawalRank(b.command.model_name))
      : list
})

// Each list reorders only its own subset; the shared csc.order is sorted per-subset by the engine.
async function reorder(orderedIds: number[]) {
  await commandSequenceStore.reorder(props.commandSequence.id, orderedIds)
}

async function toggleAccumulationLock() {
  await commandSequenceStore.patch(props.commandSequence.id, {
    accumulation_ordering_type: accumulationLocked.value ? 'custom' : 'predefined',
  })
}

async function toggleWithdrawalLock() {
  await commandSequenceStore.patch(props.commandSequence.id, {
    withdrawal_ordering_type: withdrawalLocked.value ? 'custom' : 'predefined',
  })
}

async function toggleCommand(csc: CommandSequenceCommandWithRelations) {
  const prev = csc.is_active
  const next = !prev
  csc.is_active = next
  try {
    await commandSequenceStore.toggleCommand(csc.id, props.commandSequence.id, next)
  } catch {
    csc.is_active = prev
  }
}
</script>

<template>
  <n-tabs v-model:value="view" type="segment" size="small" class="mb-3">
    <n-tab name="contributions">Contributions</n-tab>
    <n-tab name="withdrawals">Withdrawals</n-tab>
  </n-tabs>

  <CommandOrderList
      v-show="view === 'contributions'"
      :commands="accumulationCommands"
      :plan="plan"
      :locked="accumulationLocked"
      predefined-hint="income → debt → expense → savings"
      @reorder="reorder"
      @toggle-lock="toggleAccumulationLock"
      @toggle-command="toggleCommand"
      @update="emit('update', $event)"
      @delete="emit('delete', $event)"
  />

  <CommandOrderList
      v-show="view === 'withdrawals'"
      :commands="withdrawalCommands"
      :plan="plan"
      :locked="withdrawalLocked"
      predefined-hint="taxable → tax-deferred → tax-exempt → cash reserve (last)"
      @reorder="reorder"
      @toggle-lock="toggleWithdrawalLock"
      @toggle-command="toggleCommand"
      @update="emit('update', $event)"
      @delete="emit('delete', $event)"
  />
</template>

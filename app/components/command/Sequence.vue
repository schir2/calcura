<script setup lang="ts">
import draggable from 'vuedraggable';
import type {CommandSequenceWithRelations} from "#shared/types/CommandSequence";
import type {CommandSequenceCommandWithRelations} from "#shared/types/CommandSequenceCommand";
import type {PlanWithRelations} from "#shared/types/Plan";
import type {ModelName} from "#shared/types/ModelName";
import {
  BrokerageListItem,
  CashReserveListItem,
  DebtListItem,
  ExpenseListItem,
  HsaListItem,
  IncomeListItem,
  IraListItem,
  RothIraListItem,
  TaxDeferredListItem
} from "#components";

type Props = {
  commandSequence: CommandSequenceWithRelations,
  plan: PlanWithRelations,
}

const props = defineProps<Props>()
const commandSequenceStore = useCommandSequenceStore()

const commandsRef = ref<CommandSequenceCommandWithRelations[]>([...props.commandSequence.command_sequence_commands])
watch(() => props.commandSequence.command_sequence_commands, (newCommands) => {
  commandsRef.value = [...newCommands];
}, {deep: true});

const emit = defineEmits<{
  update: [payload: { modelName: ModelName, id: number, data: Record<string, unknown> }]
  delete: [payload: { modelName: ModelName, id: number }]
}>()

const PREDEFINED_ORDER: Record<ModelName, number> = {
  'income': 1,
  'debt': 2,
  'expense': 3,
  'cash_reserve': 4,
  'tax_deferred': 5,
  'roth_ira': 6,
  'ira': 7,
  'brokerage': 8,
  'hsa': 9,
}

async function onChange() {
  drag.value = false
  await commandSequenceStore.reorder(props.commandSequence.id, commandsRef.value.map(csc => csc.id))
  if (props.commandSequence.ordering_type !== 'custom') {
    await commandSequenceStore.patch(props.commandSequence.id, {ordering_type: 'custom'})
  }
}

async function applyPredefinedOrder() {
  const ordered = [...commandsRef.value].sort((a, b) =>
      (PREDEFINED_ORDER[a.command.model_name] ?? 100) - (PREDEFINED_ORDER[b.command.model_name] ?? 100)
  )
  commandsRef.value = ordered
  await commandSequenceStore.reorder(props.commandSequence.id, ordered.map(csc => csc.id))
  await commandSequenceStore.patch(props.commandSequence.id, {ordering_type: 'predefined'})
}

async function handleOrderingTypeChange(value: 'predefined' | 'custom') {
  if (value === 'predefined') {
    await applyPredefinedOrder()
  }
}

function renderComponent(plan: PlanWithRelations, modelName: ModelName, modelId: number) {
  switch (modelName) {
    case 'expense': {
      const expense = plan.expenses.find(elem => elem.id === modelId);
      return expense ? h(ExpenseListItem, {expense}) : null;
    }
    case 'tax_deferred': {
      const taxDeferred = plan.tax_deferreds.find(elem => elem.id === modelId);
      return taxDeferred ? h(TaxDeferredListItem, {taxDeferred, incomes: plan.incomes}) : null;
    }
    case 'brokerage': {
      const brokerage = plan.brokerages.find(elem => elem.id === modelId);
      return brokerage ? h(BrokerageListItem, {brokerage, incomes: plan.incomes}) : null;
    }
    case 'cash_reserve': {
      const cashReserve = plan.cash_reserves.find(elem => elem.id === modelId);
      return cashReserve ? h(CashReserveListItem, {cashReserve}) : null;
    }
    case 'debt': {
      const debt = plan.debts.find(elem => elem.id === modelId);
      return debt ? h(DebtListItem, {debt}) : null;
    }
    case 'income': {
      const income = plan.incomes.find(elem => elem.id === modelId);
      return income ? h(IncomeListItem, {income}) : null;
    }
    case 'ira': {
      const ira = plan.iras.find(elem => elem.id === modelId);
      return ira ? h(IraListItem, {ira}) : null;
    }
    case 'roth_ira': {
      const rothIra = plan.roth_iras.find(elem => elem.id === modelId);
      return rothIra ? h(RothIraListItem, {rothIra}) : null;
    }
    case 'hsa': {
      const hsa = plan.hsas.find(elem => elem.id === modelId);
      return hsa ? h(HsaListItem, {hsa}) : null;
    }
  }
  return null;
}

async function updateCommandState(csc: CommandSequenceCommandWithRelations) {
  const prev = csc.is_active
  const next = !prev
  csc.is_active = next
  try {
    await commandSequenceStore.toggleCommand(csc.id, props.commandSequence.id, next)
  } catch {
    csc.is_active = prev
  }
}


const drag = ref<boolean>(false)

function handleUpdate(modelName: ModelName, id: number, data: Record<string, unknown>) {
  emit("update", {modelName, id, data})
}

function handleDelete(modelName: ModelName, id: number) {
  emit("delete", {modelName, id})
}
</script>
<template>
  <div class="flex items-center gap-2 mb-2">
    <span class="text-sm text-skin-muted">Order:</span>
    <n-radio-group
        :value="commandSequence.ordering_type"
        size="small"
        @update:value="handleOrderingTypeChange"
    >
      <n-radio-button value="predefined">Predefined</n-radio-button>
      <n-radio-button value="custom">Custom</n-radio-button>
    </n-radio-group>
  </div>
  <draggable class="dragArea list-group w-full space-y-1"
             v-model="commandsRef"
             group="commands"
             handle=".drag-handle"
             @start="drag=true"
             :animation="300"
             item-key="id"
             @end="onChange">
    <template #item="{element: command} : {element: CommandSequenceCommandWithRelations}">
      <div class="flex gap-2 items-center border-skin-base/30 bg-skin-surface rounded border p-1">
        <base-ico class="text-2xl text-skin-primary/80 drag-handle cursor-move" name="drag"/>
        <n-switch
            :round="false"
            size="small"
            :value="command.is_active"
            @update:value="() => updateCommandState(command)"
        />
        <component
            :is="renderComponent(plan, command.command.model_name, command.command.model_id)"
            @update="(id, update) => handleUpdate(command.command.model_name, id, update)"
            @delete="(id) => handleDelete(command.command.model_name, id)"
        />
      </div>
    </template>
  </draggable>

</template>
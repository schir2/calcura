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

function onChange() {
  drag.value = false
  commandSequenceStore.reorder(props.commandSequence.id, commandsRef.value.map(csc => csc.id))
}

function setDefaultOrder() {
  const orderPriority: Record<ModelName, number> = {
    'income': 1,
    'debt': 2,
    'expense': 3,
    'cash_reserve': 4,
    'tax_deferred': 5,
    'roth_ira': 6,
    'ira': 7,
    'brokerage': 8,
    'hsa': 9,
  };

  const ordered = [...commandsRef.value].sort((a, b) => {
    return (orderPriority[a.command.model_name] ?? 100) - (orderPriority[b.command.model_name] ?? 100);
  });

  commandSequenceStore.reorder(props.commandSequence.id, ordered.map(csc => csc.id));
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

function updateCommandState(csc: CommandSequenceCommandWithRelations) {
  commandSequenceStore.toggleCommand(csc.id, props.commandSequence.id);
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
  <n-button @click="setDefaultOrder">Reset</n-button>
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
<script setup lang="ts">
import type {Command} from "#shared/types/Command";
import draggable from 'vuedraggable';
import type {CommandSequence} from "#shared/types/CommandSequence";
import type {PlanWithRelations as Plan} from "#shared/types/Plan";
import type {ModelName} from "#shared/types/ModelName";
import {
  BrokerageListItem,
  CashReserveListItem,
  DebtListItem,
  ExpenseListItem,
  IncomeListItem,
  IraListItem,
  RothIraListItem,
  TaxDeferredListItem
} from "#components";

type Props = {
  commandSequence: CommandSequence,
  plan: Plan,
}

const props = defineProps<Props>()
const commandsRef = ref(props.commandSequence.commands)
watch(() => props.commandSequence.commands, (newCommands) => {
  commandsRef.value = [...newCommands];
}, {deep: true});

const emit = defineEmits<{
  update: [payload: { modelName: ModelName, id: number, data: Record<string, unknown> }]
  delete: [payload: { modelName: ModelName, id: number }]
  remove: [payload: { modelName: ModelName, data: unknown }]
  'update-sequence': [sequence: CommandSequence]
}>()

const reorderedCommands = computed(() => {
  let order = 0
  return commandsRef.value.map((command: Command) => {
    order++
    return {
      ...command,
      order: order
    }
  })
})

function onChange() {

  drag.value = false
  emit('update-sequence', {
        ...props.commandSequence,
        commands: reorderedCommands.value
      }
  )
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
  };

  commandsRef.value = [...commandsRef.value].sort((a, b) => {
    return (orderPriority[a.modelName] || 100) - (orderPriority[b.modelName] || 100);
  }).map((command, index) => ({
    ...command,
    order: index + 1
  }));

  emit('update-sequence', {
    ...props.commandSequence,
    commands: commandsRef.value
  });
}


function getRelatedModelById(plan: Plan, modelName: ModelName, id: number) {
  const name = `${modelName}s`
  return plan[name].find(elem => elem.id === id)
}

function renderComponent(plan: Plan, modelName: ModelName, modelId: number) {
  const data = getRelatedModelById(plan, modelName, modelId);
  if (!data) return null;

  let component = null;
  let props = {};
  switch (modelName) {
    case 'expense':
      component = ExpenseListItem;
      props = {expense: data};
      break;
    case 'tax_deferred':
      component = TaxDeferredListItem;
      props = {taxDeferred: data, incomes: plan.incomes};
      break;
    case 'brokerage':
      component = BrokerageListItem;
      props = {brokerage: data, incomes: plan.incomes};
      break;
    case 'cash_reserve':
      component = CashReserveListItem;
      props = {cashReserve: data};
      break;
    case 'debt':
      component = DebtListItem;
      props = {debt: data};
      break;
    case 'income':
      component = IncomeListItem;
      props = {income: data};
      break;
    case 'ira':
      component = IraListItem;
      props = {ira: data};
      break;
    case 'roth_ira':
      component = RothIraListItem;
      props = {rothIra: data};
      break;
  }

  return h(component, props);
}

function updateCommandState(command: Command, newValue: boolean) {
  const index = commandsRef.value.findIndex(c => c.model_id === command.model_id);
  if (index !== -1) {
    commandsRef.value[index].is_active = newValue;
    emit('update-sequence', {
      ...props.commandSequence,
      commands: commandsRef.value
    });
  }
}


const drag = ref<boolean>(false)

function handleUpdate(modelName: ModelName, id: number, data: Record<string, unknown>) {
  emit("update", {modelName, id, data})
}

function handleDelete(modelName: ModelName, id: number) {
  emit("delete", {modelName, id})
}

function handleRemove(modelName: ModelName, data: unknown) {
  emit("remove", {modelName, data})
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
    <template #item="{element: command} : {element: Command}">
      <div class="flex gap-2 items-center border-skin-base/30 bg-skin-surface rounded border p-1">
        <base-ico class="text-2xl text-skin-primary/80 drag-handle cursor-move" name="drag"/>
        <n-switch
            :round="false"
            size="small"
            :value="command.is_active"
            @update:value="(newValue) => updateCommandState(command, newValue)"
        />
        <component
            :is="renderComponent(plan, command.model_name, command.model_id)"
            @update="(id, update) => handleUpdate(command.model_name, id, update)"
            @delete="(id) => handleDelete(command.model_name, id)"
            @remove="(entity) => handleRemove(command.model_name, entity)"
        />
      </div>
    </template>
  </draggable>

</template>
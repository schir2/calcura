<script setup lang="ts">
import type {Command} from "~/types/Command";
import draggable from 'vuedraggable';
import type {CommandSequence} from "~/types/CommandSequence";
import type {Plan} from "~/types/Plan";
import {ModelName} from "~/types/ModelName";
import {
  BrokerageListItem,
  CashReserveListItem,
  DebtListItem,
  ExpenseListItem,
  IncomeListItem,
  IraListItem,
  PlanListItem,
  RothIraListItem,
  TaxDeferredListItem
} from "#components";

interface Props {
  commandSequence: CommandSequence,
  plan: Plan,
}

const props = defineProps<Props>()
const commandsRef = ref(props.commandSequence.commands)
watch(() => props.commandSequence.commands, (newCommands) => {
  commandsRef.value = [...newCommands];
}, {deep: true});

const emit = defineEmits(['update', 'delete', 'remove', 'update-sequence']);

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
    case ModelName.Expense:
      component = ExpenseListItem;
      props = {expense: data};
      break;
    case ModelName.TaxDeferred:
      component = TaxDeferredListItem;
      props = {taxDeferred: data};
      break;
    case ModelName.Brokerage:
      component = BrokerageListItem;
      props = {brokerage: data};
      break;
    case ModelName.CashReserve:
      component = CashReserveListItem;
      props = {cashReserve: data};
      break;
    case ModelName.Debt:
      component = DebtListItem;
      props = {debt: data};
      break;
    case ModelName.Income:
      component = IncomeListItem;
      props = {income: data};
      break;
    case ModelName.Ira:
      component = IraListItem;
      props = {ira: data};
      break;
    case ModelName.RothIra:
      component = RothIraListItem;
      props = {rothIra: data};
      break;
    case ModelName.Plan:
      component = PlanListItem;
      props = {plan: data};
      break;
  }

  return h(component, props);
}

function updateCommandState(command: Command, newValue: boolean) {
  const index = commandsRef.value.findIndex(c => c.commandSequenceCommandId === command.commandSequenceCommandId);
  if (index !== -1) {
    commandsRef.value[index].isActive = newValue;
    emit('update-sequence', {
      ...props.commandSequence,
      commands: commandsRef.value
    });
  }
}


const drag = ref<boolean>(false)

function handleUpdate(modelName: ModelName, data: Object){
  emit("update", {modelName: modelName, data:data})
}

function handleDelete(modelName: ModelName, data: Object){
  emit("delete", {modelName: modelName, data:data})
}

function handleRemove(modelName: ModelName, data: Object){
  emit("remove", {modelName: modelName, data:data})
}
</script>
<template>
  <draggable class="dragArea list-group w-full"
             v-model="commandsRef"
             group="commands"
             handle=".drag-handle"
             @start="drag=true"
             :animation="300"
             item-key="id"
             @end="onChange">
    <template #item="{element: command} : {element: Command}">
      <div class="flex gap-2 items-center">
        <base-ico class="text-2xl text-skin-primary/80 drag-handle cursor-move" name="drag"/>
        <n-switch
            :round="false"
            :value="command.isActive"
            @update:value="(newValue) => updateCommandState(command, newValue)"
        />
        <component
            :is="renderComponent(plan, command.modelName, command.modelId)"
            @update="handleUpdate(command.modelName, $event)"
            @delete="handleDelete(command.modelName, $event)"
            @remove="handleRemove(command.modelName, $event)"
        />
      </div>
    </template>
  </draggable>

</template>
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

const drag = ref<boolean>(false)
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
      <div>
        <component
            :is="renderComponent(plan, command.modelName, command.modelId)"
            @update="$emit('update', command.modelName, $event)"
            @delete="$emit('delete', command.modelName, $event.id)"
            @remove="$emit('remove', command.modelName, $event.id)"
        />
      </div>
    </template>
  </draggable>

</template>
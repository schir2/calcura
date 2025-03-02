<script lang="ts" setup>
import type {Plan} from "~/types/Plan";
import {ModelNameUpperCase} from "~/types/ModelName";
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
  plan: Plan
}

const props = defineProps<Props>()

const activeTab = ref<number | null>(null);

async function handleAdd() {

}

async function handleClose() {

}

function getRelatedModelById(plan: Plan, modelName: ModelNameUpperCase, id: number) {
  const name = `${toLowerFirstLetter(modelName)}s`
  return plan[name].find(elem => elem.id === id)
}

function toLowerFirstLetter(str: string) {
  return `${str[0].toLowerCase()}${str.slice(1)}`
}

function renderComponent(plan: Plan, modelName: ModelNameUpperCase, modelId: number) {
  const data = getRelatedModelById(plan, modelName, modelId);
  if (!data) return null;

  let component = null;
  let props = {};
  switch (modelName) {
    case ModelNameUpperCase.Expense:
      component = ExpenseListItem;
      props = {expense: data};
      break;
    case ModelNameUpperCase.TaxDeferred:
      component = TaxDeferredListItem;
      props = {taxDeferred: data};
      break;
    case ModelNameUpperCase.Brokerage:
      component = BrokerageListItem;
      props = {brokerage: data};
      break;
    case ModelNameUpperCase.CashReserve:
      component = CashReserveListItem;
      props = {cashReserve: data};
      break;
    case ModelNameUpperCase.Debt:
      component = DebtListItem;
      props = {debt: data};
      break;
    case ModelNameUpperCase.Income:
      component = IncomeListItem;
      props = {income: data};
      break;
    case ModelNameUpperCase.Ira:
      component = IraListItem;
      props = {ira: data};
      break;
    case ModelNameUpperCase.RothIra:
      component = RothIraListItem;
      props = {rothIra: data};
      break;
    case ModelNameUpperCase.Plan:
      component = PlanListItem;
      props = {plan: data};
      break;
  }

  return h(component, props);
}

onMounted(async () => {
  if (props.plan?.commandSequences?.length > 0) {
    activeTab.value = props.plan.commandSequences[0].id
  }
})

</script>
<template>
  <n-tabs
      v-model:value="activeTab"
      type="card"
      :addable="true"
      :closable="true"
      tab-style="min-width: 80px;"
      @close="handleClose"
      @add="handleAdd"
  >
    <n-tab-pane v-for="commandSequence in plan.commandSequences" :key="commandSequence.id" :name="commandSequence.id">
      <template #tab>{{ commandSequence.name }}</template>

      <template v-for="command in commandSequence.commands" :key="command.id">
        <component
            :is="renderComponent(plan, command.modelName, command.modelId)"
            @update="$emit('update', toLowerFirstLetter(command.modelName), $event)"
            @delete="$emit('delete', toLowerFirstLetter(command.modelName), $event.id)"
            @remove="$emit('remove', toLowerFirstLetter(command.modelName), $event.id)"
        />
      </template>
    </n-tab-pane>
  </n-tabs>
</template>
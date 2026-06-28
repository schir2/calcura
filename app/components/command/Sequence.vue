<script setup lang="ts">
import draggable from 'vuedraggable';
import type {CommandSequenceWithRelations} from "#shared/types/CommandSequence";
import type {CommandSequenceCommandWithRelations} from "#shared/types/CommandSequenceCommand";
import type {PlanWithRelations} from "#shared/types/Plan";
import type {ModelName} from "#shared/types/ModelName";
import {predefinedOrderRank} from "~/constants/CommandOrder";
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

const isPredefined = computed(() => props.commandSequence.ordering_type === 'predefined')

async function onChange() {
  drag.value = false
  await commandSequenceStore.reorder(props.commandSequence.id, commandsRef.value.map(csc => csc.id))
  if (isPredefined.value) {
    await commandSequenceStore.patch(props.commandSequence.id, {ordering_type: 'custom'})
  }
}

async function applyPredefinedOrder() {
  sortCommandsRefPredefined()
  await commandSequenceStore.patch(props.commandSequence.id, {ordering_type: 'predefined'})
}

async function setCustom() {
  await commandSequenceStore.patch(props.commandSequence.id, {ordering_type: 'custom'})
}

function sortCommandsRefPredefined() {
  commandsRef.value = [...commandsRef.value].sort((a, b) =>
      predefinedOrderRank(a.command.model_name) - predefinedOrderRank(b.command.model_name)
  )
}

watch(isPredefined, (locked) => {
  if (locked) sortCommandsRefPredefined()
  else commandsRef.value = [...props.commandSequence.command_sequence_commands]
})

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
  <div
      class="flex items-center gap-2.5 px-2.5 py-1.5 mb-2 rounded border text-xs"
      :class="isPredefined
        ? 'border-blue-200 bg-blue-50 dark:bg-blue-950/30'
        : 'border-skin-base/20 bg-skin-surface'"
  >
    <n-button
        size="tiny"
        :type="isPredefined ? 'info' : 'default'"
        :secondary="isPredefined"
        @click="isPredefined ? setCustom() : applyPredefinedOrder()"
    >
      <template #icon>
        <base-ico :name="isPredefined ? 'lock' : 'unlock'"/>
      </template>
      {{ isPredefined ? 'Locked — predefined' : 'Unlocked — custom' }}
    </n-button>
    <span :class="isPredefined ? 'text-blue-600 dark:text-blue-300' : 'text-skin-muted'">
      {{ isPredefined ? 'income → debt → expense → savings' : 'drag handles to reorder' }}
    </span>
  </div>

  <draggable class="dragArea list-group w-full space-y-1"
             v-model="commandsRef"
             group="commands"
             handle=".drag-handle"
             @start="drag=true"
             :animation="300"
             item-key="id"
             :disabled="isPredefined"
             @end="onChange">
    <template #item="{element: command} : {element: CommandSequenceCommandWithRelations}">
      <div class="flex gap-2 items-center border-skin-base/30 bg-skin-surface rounded border p-1">
        <base-ico
            :class="['text-2xl drag-handle', isPredefined ? 'opacity-20 cursor-not-allowed' : 'text-skin-primary/80 cursor-move']"
            name="drag"
        />
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

<template>
  <n-button-group>
    <n-button
        v-for="item in items"
        :key="item.name"
        @click="handleOpenCreateModal(item)"
        :type="item.buttonType"
        secondary
        round
    >
      <template #icon>
        <BaseIco :name="item.name"/>
      </template>
      {{ item.label }}
    </n-button>
  </n-button-group>
  <n-modal v-model:show="showModal">
    <component v-if="selectedChildProp"
               :is="selectedChildProp.form"
               :initial-values="{ plan_id }"
               @create="handleCreate($event)"
               @cancel="handleClose"
    />
  </n-modal>
</template>
<script setup lang="ts">
import type {ModelName} from "#shared/types/ModelName";
import {WORKSPACE_ENABLED_MODELS} from "~/stores/workspaceStore";

const { plan_id } = defineProps<{ plan_id: number }>()

const workspace = useWorkspaceStore()

import {
  BrokerageCreateForm,
  CashReserveCreateForm,
  DebtCreateForm,
  ExpenseCreateForm,
  HsaCreateForm,
  IncomeCreateForm,
  IraCreateForm,
  RothIraCreateForm,
  TaxDeferredCreateForm,
} from "#components";

type CreateButtonProps = { name: ModelName, label: string, form: Component, buttonType: string };

const items: CreateButtonProps[] = [
  {name: 'income', label: 'Income', form: IncomeCreateForm, buttonType: 'primary'},
  {name: 'expense', label: 'Expense', form: ExpenseCreateForm, buttonType: 'warning'},
  {name: 'debt', label: 'Debt', form: DebtCreateForm, buttonType: 'error'},
  {name: 'cash_reserve', label: 'Cash Reserve', form: CashReserveCreateForm, buttonType: 'info'},
  {name: 'tax_deferred', label: '401k', form: TaxDeferredCreateForm, buttonType: 'info'},
  {name: 'roth_ira', label: 'Roth', form: RothIraCreateForm, buttonType: 'info'},
  {name: 'ira', label: 'IRA', form: IraCreateForm, buttonType: 'info'},
  {name: 'brokerage', label: 'Brokerage', form: BrokerageCreateForm, buttonType: 'info'},
  {name: 'hsa', label: 'HSA', form: HsaCreateForm, buttonType: 'info'},
];

const showModal = ref<boolean>(false)
const selectedChildProp = ref<CreateButtonProps | null>(null)

const emit = defineEmits<{
  'create-model': [payload: { model: ModelName, data: unknown }]
}>()

function handleOpenCreateModal(item: CreateButtonProps) {
  if (WORKSPACE_ENABLED_MODELS.includes(item.name)) {
    workspace.openCreate(item.name, plan_id)
    return
  }
  selectedChildProp.value = item
  showModal.value = true;
}

function handleCreate(data: any) {
  emit('create-model', {model: selectedChildProp.value.name, data: data})
  showModal.value = false
}

function handleClose() {
  showModal.value = false
}
</script>
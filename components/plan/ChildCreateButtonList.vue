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
  <lazy-n-modal v-model:show="showModal">
    <component v-if="selectedChildProp"
               :is="selectedChildProp.form" mode="create"
               @create="handleCreate($event)"
               @cancel="handleClose"
    />
  </lazy-n-modal>
</template>
<script setup lang="ts">
import {ModelName} from "~/types/ModelName";
import {
  BrokerageForm,
  CashReserveForm,
  DebtForm,
  ExpenseForm,
  IncomeForm,
  IraForm,
  RothIraForm,
  TaxDeferredForm,
} from "#components";

type CreateButtonProps = { name: ModelName, label: string, form: Component, buttonType: string };

const items: CreateButtonProps[] = [
  {name: ModelName.Income, label: 'Income', form: IncomeForm, buttonType: 'primary'},
  {name: ModelName.Expense, label: 'Expense', form: ExpenseForm, buttonType: 'warning'},
  {name: ModelName.Debt, label: 'Debt', form: DebtForm, buttonType: 'error'},
  {name: ModelName.CashReserve, label: 'Cash Reserve', form: CashReserveForm, buttonType: 'info'},
  {name: ModelName.TaxDeferred, label: '401k', form: TaxDeferredForm, buttonType: 'info'},
  {name: ModelName.RothIra, label: 'Roth', form: RothIraForm, buttonType: 'info'},
  {name: ModelName.Ira, label: 'IRA', form: IraForm, buttonType: 'info'},
  {name: ModelName.Brokerage, label: 'Brokerage', form: BrokerageForm, buttonType: 'info'},
];

const showModal = ref<boolean>(false)
const selectedChildProp = ref<CreateButtonProps | null>(null)

const emit = defineEmits(['create-model'])

function handleOpenCreateModal(item: CreateButtonProps) {
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
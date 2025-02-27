<template>
  <n-button-group>
    <n-button
        v-for="item in items"
        :key="item.name"
        @click="handleOpenCreateModal(item)"
    >
      <template #icon>
        <BaseIco :name="item.name"/>
      </template>
      {{ item.label }}
    </n-button>
  </n-button-group>
  <n-modal v-model:show="showModal">
    <component v-if="selectedModel"
        :is="selectedModel.form" mode="create"
        @create="handleCreate($event)"
        @cancel="handleClose"
    />
  </n-modal>
</template>
<script setup lang="ts">
import {ModelName} from "~/types/ModelName";
import {
  BrokerageInvestmentForm,
  CashReserveForm,
  DebtForm,
  ExpenseForm,
  IncomeForm,
  IraInvestmentForm,
  RothIraInvestmentForm,
  TaxDeferredInvestmentForm,
} from "#components";

type CreateButtonProps = { name: ModelName, label: string, form: Component }

const items: CreateButtonProps[] = [
  {name: ModelName.TaxDeferredInvestment, label: '401k', form: TaxDeferredInvestmentForm},
  {name: ModelName.BrokerageInvestment, label: 'Brokerage', form: BrokerageInvestmentForm},
  {name: ModelName.CashReserve, label: 'Cash Reserve', form: CashReserveForm},
  {name: ModelName.Debt, label: 'Debt', form: DebtForm},
  {name: ModelName.Expense, label: 'Expense', form: ExpenseForm},
  {name: ModelName.Income, label: 'Income', form: IncomeForm},
  {name: ModelName.IraInvestment, label: 'IRA', form: IraInvestmentForm},
  {name: ModelName.RothIraInvestment, label: 'Roth', form: RothIraInvestmentForm},
];

const showModal = ref<boolean>(false)
const selectedModel = ref<CreateButtonProps | null>(null)

const emit = defineEmits(['create-model'])

function handleOpenCreateModal(item: CreateButtonProps) {
  selectedModel.value = item
  showModal.value = true;
}

function handleCreate(data: any) {
  emit('create-model', {model: selectedModel.value, data: data})
  showModal.value = false
}

function handleClose() {
  showModal.value = false
}
</script>
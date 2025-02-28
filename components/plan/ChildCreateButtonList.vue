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
    <component v-if="selectedChildProp"
               :is="selectedChildProp.form" mode="create"
               @create="handleCreate($event)"
               @cancel="handleClose"
    />
  </n-modal>
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

type CreateButtonProps = { name: ModelName, label: string, form: Component }

const items: CreateButtonProps[] = [
  {name: ModelName.TaxDeferred, label: '401k', form: TaxDeferredForm},
  {name: ModelName.Brokerage, label: 'Brokerage', form: BrokerageForm},
  {name: ModelName.CashReserve, label: 'Cash Reserve', form: CashReserveForm},
  {name: ModelName.Debt, label: 'Debt', form: DebtForm},
  {name: ModelName.Expense, label: 'Expense', form: ExpenseForm},
  {name: ModelName.Income, label: 'Income', form: IncomeForm},
  {name: ModelName.Ira, label: 'IRA', form: IraForm},
  {name: ModelName.RothIra, label: 'Roth', form: RothIraForm},
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
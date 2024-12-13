<template>
  <Form>
    <div class="flex justify-between align-middle">
      <h3 class="text-lg">Expense</h3>
      <n-button-group size="small">
        <NButton secondary round v-if="isModified" type="success" @click="updateExpense">
          <template #icon>
            <Icon name="mdi:content-save"/>
          </template>
          Save
        </NButton>
        <NButton secondary round v-if="isModified" type="warning" @click="resetExpense">
          <template #icon>
            <Icon name="mdi:history"/>
          </template>
          Reset
        </NButton>
        <NButton secondary round type="error" @click="deleteExpense">
          <template #icon>
            <Icon name="mdi:delete"/>
          </template>
          Delete
        </NButton>
      </n-button-group>
    </div>
    <CommonCard>
      <FormField :model="currentExpenseConfig" :field="fieldMetadata.name"></FormField>
      <FormSelect :model="currentExpenseConfig" :field="fieldMetadata.frequency"></FormSelect>
      <FormField :model="currentExpenseConfig" :field="fieldMetadata.amount"></FormField>
      <n-number-animation v-if="currentExpenseConfig && prevAmount && currentAmount"
          :from="prevAmount"
          :to="currentAmount"
          :duration="1000"
      />
      <FormSelect :model="currentExpenseConfig" :field="fieldMetadata.type"></FormSelect>
      <FormToggle :model="currentExpenseConfig" :field="fieldMetadata.isEssential"></FormToggle>
      <FormToggle :model="currentExpenseConfig" :field="fieldMetadata.isTaxDeductible"></FormToggle>
    </CommonCard>
  </Form>
</template>
<script setup lang="ts">
import {useEntityManager} from '~/composables/useEntityManager';
import {expenseFields} from '~/forms/expenseForm';
import type {Expense} from '~/models/expense/Expense';
import {getAnnualExpenseAmount} from "~/utils/expenseUtils";

interface Props {
  expense: Expense;
  showAdvancedOptions?: boolean;
}

const {showAdvancedOptions = false, expense} = defineProps<Props>();
const fieldMetadata = expenseFields;

const emit = defineEmits(['deleteExpense', 'updateExpense']);

const {
  currentConfig: currentExpenseConfig,
  isModified,
  resetEntity: resetExpense,
  deleteEntity: deleteExpense,
  updateEntity: updateExpense
} = useEntityManager<Expense>(expense, emit, 'expense');


const prevAmount = ref(0);
const currentAmount = computed(() => getAnnualExpenseAmount(currentExpenseConfig.value));

watch(
    currentExpenseConfig,
    (newConfig: Expense, oldConfig: Expense) => {
      console.log(newConfig)
      console.log(oldConfig)
      if (expense){
      prevAmount.value = getAnnualExpenseAmount(oldConfig);
    }
      }
);
</script>
<template>
  <NButton @click="handleCreateExpense()">Add</NButton>
  <div class="container">
    <Expense v-for="(debtConfig, index) in debts" :debtConfig="debtConfig" :key="debtConfig.id"
          @deleteExpense="handleDeleteExpense" @updateExpense="handleUpdateExpense"></Expense>
  </div>

</template>
<script lang="ts" setup>
interface Props {
  debts: ExpenseConfig[]
}

const props = defineProps<Props>()

const emit = defineEmits(['deleteExpense', 'updateExpense', 'createExpense']);
function handleDeleteExpense(debtId: number){
  emit('deleteExpense',debtId);
}
function handleCreateExpense(){
  emit('createExpense');
}

function handleUpdateExpense(debtConfig: debtConfig) {
  emit('updateExpense', debtConfig);
}

</script>
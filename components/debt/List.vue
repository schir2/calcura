<template>
  <CommonButton @click="handleCreateDebt()">Add</CommonButton>
  <div class="container">
    <Debt v-for="(debtConfig, index) in debts" :debtConfig="debtConfig" :key="debtConfig.id"
          @deleteDebt="handleDeleteDebt" @updateDebt="handleUpdateDebt"></Debt>
  </div>

</template>
<script lang="ts" setup>
interface Props {
  debts: DebtConfig[]
}

const props = defineProps<Props>()

const emit = defineEmits(['deleteDebt', 'updateDebt', 'createDebt']);
function handleDeleteDebt(debtId: number){
  emit('deleteDebt',debtId);
}
function handleCreateDebt(){
  emit('createDebt');
}

function handleUpdateDebt(debtConfig: debtConfig) {
  emit('updateDebt', debtConfig);
}

</script>
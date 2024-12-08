<template>
  <CommonButton @click="handleCreateDebt()">Add</CommonButton>
  <div class="container">
    <Debt v-for="(debtConfig, index) in debts" :debtConfig="debtConfig" :key="debtConfig.id"
          @deleteDebt="handleDeleteDebt" @updateDebt="handleUpdateDebt"></Debt>
  </div>

</template>
<script lang="ts" setup>
interface Props {
  debts: CashConfig[]
}

const props = defineProps<Props>()

const emit = defineEmits(['deleteCash', 'updateCash', 'createCash']);
function handleDeleteCash(debtId: number){
  emit('deleteCash',debtId);
}
function handleCreateCash(){
  emit('createCash');
}

function handleUpdateCash(debtConfig: debtConfig) {
  emit('updateCash', debtConfig);
}

</script>
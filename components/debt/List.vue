<template>
  <NButton @click="handleCreateDebt()">Add</NButton>
  <div class="container">
    <Debt v-for="(debtConfig, index) in debts" :debtConfig="debtConfig" :key="debtConfig.id"
          @deleteDebt="handleDeleteDebt" @updateDebt="handleUpdateDebt"></Debt>
  </div>

</template>
<script lang="ts" setup>
import type Debt from "~/models/debt/Debt";

interface Props {
  debts: Debt[]
}

const props = defineProps<Props>()

const emit = defineEmits(['deleteDebt', 'updateDebt', 'createDebt']);
function handleDeleteDebt(debtId: number){
  emit('deleteDebt',debtId);
}
function handleCreateDebt(){
  emit('createDebt');
}

function handleUpdateDebt(debtConfig: Debt) {
  emit('updateDebt', debtConfig);
}

</script>
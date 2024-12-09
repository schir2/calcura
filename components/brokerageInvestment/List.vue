<template>
  <NButton @click="handleCreateBrokerageInvestment()">Add</NButton>
  <div class="container">
    <BrokerageInvestment v-for="(debtConfig, index) in debts" :debtConfig="debtConfig" :key="debtConfig.id"
          @deleteBrokerageInvestment="handleDeleteBrokerageInvestment" @updateBrokerageInvestment="handleUpdateBrokerageInvestment"></BrokerageInvestment>
  </div>

</template>
<script lang="ts" setup>
interface Props {
  debts: BrokerageInvestmentConfig[]
}

const props = defineProps<Props>()

const emit = defineEmits(['deleteBrokerageInvestment', 'updateBrokerageInvestment', 'createBrokerageInvestment']);
function handleDeleteBrokerageInvestment(debtId: number){
  emit('deleteBrokerageInvestment',debtId);
}
function handleCreateBrokerageInvestment(){
  emit('createBrokerageInvestment');
}

function handleUpdateBrokerageInvestment(debtConfig: debtConfig) {
  emit('updateBrokerageInvestment', debtConfig);
}

</script>
<template>

  <h2 class="text-3xl">Brokerage(s)</h2>
  <NButton @click="handleCreateBrokerageInvestment()">Add</NButton>
  <div class="container">
    <BrokerageInvestment v-for="(brokerageInvestment, index) in brokerageInvestments" :brokerageInvestment="brokerageInvestment" :key="brokerageInvestment.id"
          @deleteBrokerageInvestment="handleDeleteBrokerageInvestment" @updateBrokerageInvestment="handleUpdateBrokerageInvestment"></BrokerageInvestment>
  </div>

</template>
<script lang="ts" setup>
import type {BrokerageInvestment} from "~/models/brokerageInvestment/BrokerageInvestment";

interface Props {
  brokerageInvestments: BrokerageInvestment[]
}

const props = defineProps<Props>()

const emit = defineEmits(['deleteBrokerageInvestment', 'updateBrokerageInvestment', 'createBrokerageInvestment']);
function handleDeleteBrokerageInvestment(brokerageInvestmentId: number){
  emit('deleteBrokerageInvestment',brokerageInvestmentId);
}
function handleCreateBrokerageInvestment(){
  emit('createBrokerageInvestment');
}

function handleUpdateBrokerageInvestment(brokerageInvestmentConfig: BrokerageInvestment) {
  emit('updateBrokerageInvestment', brokerageInvestmentConfig);
}

</script>
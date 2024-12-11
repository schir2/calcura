<template>
  <NButton @click="handleCreateIraInvestment()">Add</NButton>
  <div class="container">
    <IraInvestment v-for="(iraInvestment, index) in iraInvestments" :iraInvestment="iraInvestment" :key="iraInvestment.id"
          @deleteIraInvestment="handleDeleteIraInvestment" @updateIraInvestment="handleUpdateIraInvestment"></IraInvestment>
  </div>

</template>
<script lang="ts" setup>
import type {IraInvestment} from "~/models/iraInvestment/IraInvestment";

interface Props {
  iraInvestments: IraInvestment[]
}

const props = defineProps<Props>()

const emit = defineEmits(['deleteIraInvestment', 'updateIraInvestment', 'createIraInvestment']);
function handleDeleteIraInvestment(iraInvestmentId: number){
  emit('deleteIraInvestment',iraInvestmentId);
}
function handleCreateIraInvestment(){
  emit('createIraInvestment');
}

function handleUpdateIraInvestment(iraInvestmentConfig: IraInvestment) {
  emit('updateIraInvestment', iraInvestmentConfig);
}

</script>
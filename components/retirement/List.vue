<template>
  <n-button @click="handleCreateRetirement()">Add</n-button>
  <div class="container">
    <Retirement v-for="(debtConfig, index) in debts" :debtConfig="debtConfig" :key="debtConfig.id"
          @deleteRetirement="handleDeleteRetirement" @updateRetirement="handleUpdateRetirement"></Retirement>
  </div>

</template>
<script lang="ts" setup>
interface Props {
  debts: RetirementConfig[]
}

const props = defineProps<Props>()

const emit = defineEmits(['deleteRetirement', 'updateRetirement', 'createRetirement']);
function handleDeleteRetirement(debtId: number){
  emit('deleteRetirement',debtId);
}
function handleCreateRetirement(){
  emit('createRetirement');
}

function handleUpdateRetirement(debtConfig: debtConfig) {
  emit('updateRetirement', debtConfig);
}

</script>
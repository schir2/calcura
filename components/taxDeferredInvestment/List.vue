<template>
  <NButton @click="handleCreateTaxDeferredInvestment()">Add</NButton>
  <div class="container">
    <TaxDeferredInvestment v-for="(debtConfig, index) in debts" :debtConfig="debtConfig" :key="debtConfig.id"
          @deleteTaxDeferredInvestment="handleDeleteTaxDeferredInvestment" @updateTaxDeferredInvestment="handleUpdateTaxDeferredInvestment"></TaxDeferredInvestment>
  </div>

</template>
<script lang="ts" setup>
interface Props {
  debts: TaxDeferredInvestmentConfig[]
}

const props = defineProps<Props>()

const emit = defineEmits(['deleteTaxDeferredInvestment', 'updateTaxDeferredInvestment', 'createTaxDeferredInvestment']);
function handleDeleteTaxDeferredInvestment(debtId: number){
  emit('deleteTaxDeferredInvestment',debtId);
}
function handleCreateTaxDeferredInvestment(){
  emit('createTaxDeferredInvestment');
}

function handleUpdateTaxDeferredInvestment(debtConfig: debtConfig) {
  emit('updateTaxDeferredInvestment', debtConfig);
}

</script>
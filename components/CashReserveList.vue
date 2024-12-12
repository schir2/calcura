<template>

  <h2 class="text-3xl">CashReserve Reserve(s)</h2>
  <NButton @click="handleCreateCashReserve()">Add</NButton>
  <div class="container">
    <CashReserve v-for="(cashReserve, index) in cashReserves" :cashReserve="cashReserve" :key="cashReserve.id"
          @deleteCashReserve="handleDeleteCashReserve" @updateCashReserve="handleUpdateCashReserve"></CashReserve>
  </div>

</template>
<script lang="ts" setup>
import type {CashReserve} from "~/models/cashReserve/CashReserve";

interface Props {
  cashReserves: CashReserve[]
}

const props = defineProps<Props>()

const emit = defineEmits(['deleteCashReserve', 'updateCashReserve', 'createCashReserve']);
function handleDeleteCashReserve(cashReserveId: number){
  console.log(cashReserveId);
  emit('deleteCashReserve',cashReserveId);
}
function handleCreateCashReserve(){
  emit('createCashReserve');
}

function handleUpdateCashReserve(cashReserve: CashReserve) {
  emit('updateCashReserve', cashReserve);
}

</script>
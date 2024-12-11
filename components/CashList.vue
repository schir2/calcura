<template>
  <NButton @click="handleCreateCash()">Add</NButton>
  <div class="container">
    <Cash v-for="(cash, index) in cashes" :cash="cash" :key="cash.id"
          @deleteCash="handleDeleteCash" @updateCash="handleUpdateCash"></Cash>
  </div>

</template>
<script lang="ts" setup>
import type {Cash} from "~/models/cash/Cash";

interface Props {
  cashes: Cash[]
}

const props = defineProps<Props>()

const emit = defineEmits(['deleteCash', 'updateCash', 'createCash']);
function handleDeleteCash(cashId: number){
  emit('deleteCash',cashId);
}
function handleCreateCash(){
  emit('createCash');
}

function handleUpdateCash(cash: Cash) {
  emit('updateCash', cash);
}

</script>
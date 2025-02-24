<template>
  <n-card title="Cash Reserve(s)">
      <CashReserveListItem v-for="(cashReserve, index) in cashReserves" :cashReserve="cashReserve" :key="cashReserve.id"
                      @delete="handleDelete" @update="handleUpdate" @create="handleCreate"
                      @remove="handleRemove"></CashReserveListItem>
  </n-card>

</template>
<script lang="ts" setup>
import type {CashReserve, CashReserveTemplate} from "~/types/CashReserve";

interface Props {
  cashReserves: CashReserve[]
}

const props = defineProps<Props>()

const emit = defineEmits(['delete', 'update', 'create', 'remove']);

function handleDelete(cashReserve: CashReserve) {
  emit('delete', cashReserve);
}

function handleCreate(cashReserveTemplate: CashReserveTemplate) {
  emit('create', cashReserveTemplate);
}

function handleUpdate(cashReserve: CashReserve) {
  emit('update', cashReserve);
}

function handleRemove(cashReserve: CashReserve) {
  emit('remove', cashReserve)
}

</script>
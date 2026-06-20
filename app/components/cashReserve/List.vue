<template>
  <n-card title="Cash Reserve(s)">
      <CashReserveListItem v-for="(cashReserve, index) in cashReserves" :cashReserve="cashReserve" :key="cashReserve.id"
                      @delete="handleDelete" @update="handleUpdate" @create="handleCreate"></CashReserveListItem>
  </n-card>

</template>
<script lang="ts" setup>
import type {CashReserve, CashReserveInsert, CashReserveUpdate} from "#shared/types/CashReserve";

type Props = {
  cashReserves: CashReserve[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  create: [insert: CashReserveInsert]
  update: [id: number, update: CashReserveUpdate]
  delete: [id: number]
}>()

function handleDelete(id: number) {
  emit('delete', id)
}

function handleCreate(insert: CashReserveInsert) {
  emit('create', insert)
}

function handleUpdate(id: number, update: CashReserveUpdate) {
  emit('update', id, update)
}

</script>
<template>
  <n-card title="Income(s)">
    <n-list>
      <IncomeListItem v-for="(income, index) in incomes" :income="income" :key="income.id"
                      @delete="handleDelete" @update="handleUpdate" @create="handleCreate"></IncomeListItem>
    </n-list>



  </n-card>

</template>
<script lang="ts" setup>
import type {Income, IncomeInsert, IncomeUpdate} from "~/types/Income";

type Props = {
  incomes: Income[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  create: [insert: IncomeInsert]
  update: [id: number, update: IncomeUpdate]
  delete: [id: number]
}>()

function handleDelete(id: number) {
  emit('delete', id)
}

function handleCreate(insert: IncomeInsert) {
  emit('create', insert)
}

function handleUpdate(id: number, update: IncomeUpdate) {
  emit('update', id, update)
}

</script>
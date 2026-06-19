<template>
  <n-card>
    <template #header-extra>
      <DebtTemplatePicker @create="handleCreate"/>
    </template>
    <DebtListItem v-for="debt in debts" :debt="debt" :key="debt.id"
                  @delete="handleDelete" @update="handleUpdate" @create="handleCreate"></DebtListItem>

  </n-card>

</template>
<script lang="ts" setup>
import type {Debt, DebtInsert, DebtUpdate} from "~/types/Debt";

type Props = {
  debts: Debt[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  create: [insert: DebtInsert]
  update: [id: number, update: DebtUpdate]
  delete: [id: number]
}>()

function handleDelete(id: number) {
  emit('delete', id)
}

function handleCreate(insert: DebtInsert) {
  emit('create', insert)
}

function handleUpdate(id: number, update: DebtUpdate) {
  emit('update', id, update)
}

</script>
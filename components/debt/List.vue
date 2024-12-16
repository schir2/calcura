<template>
  <n-card title="Debt(s)">
    <template #header-extra>
      <DebtTemplatePicker @create="handleCreate"/>
    </template>
    <n-list>
      <DebtListItem v-for="(debt, index) in debts" :debt="debt" :key="debt.id"
                      @delete="handleDelete" @update="handleUpdate" @create="handleCreate"
                      @remove="handleRemove"></DebtListItem>
    </n-list>
  </n-card>

</template>
<script lang="ts" setup>
import type {Debt, DebtTemplate} from "~/models/debt/Debt";

interface Props {
  debts: Debt[]
}

const props = defineProps<Props>()

const emit = defineEmits(['delete', 'update', 'create', 'remove']);

function handleDelete(debt: Debt) {
  emit('delete', debt);
}

function handleCreate(debtTemplate: DebtTemplate) {
  emit('create', debtTemplate);
}

function handleUpdate(debt: Debt) {
  emit('update', debt);
}

function handleRemove(debt: Debt) {
  emit('remove', debt)
}

</script>
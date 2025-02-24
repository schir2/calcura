<template>
  <n-card>
    <template #header-extra>
      <DebtTemplatePicker @create="handleCreate"/>
    </template>
    <DebtListItem v-for="debt in debts" :debt="debt" :key="debt.id"
                  @delete="handleDelete" @update="handleUpdate" @create="handleCreate"
                  @remove="handleRemove"></DebtListItem>

  </n-card>

</template>
<script lang="ts" setup>
import type {Debt, DebtTemplate} from "~/types/Debt";

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
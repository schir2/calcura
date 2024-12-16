<template>
  <n-card title="IraInvestment(s)">
    <template #header-extra>
      <IraInvestmentTemplatePicker @create="handleCreate"/>
    </template>
    <n-list>
      <IraInvestmentListItem v-for="(iraInvestment, index) in iraInvestments" :iraInvestment="iraInvestment" :key="iraInvestment.id"
                      @delete="handleDelete" @update="handleUpdate" @create="handleCreate"
                      @remove="handleRemove"></IraInvestmentListItem>
    </n-list>
  </n-card>

</template>
<script lang="ts" setup>
import type {IraInvestment, IraInvestmentTemplate} from "~/models/iraInvestment/IraInvestment";

interface Props {
  iraInvestments: IraInvestment[]
}

const props = defineProps<Props>()

const emit = defineEmits(['delete', 'update', 'create', 'remove']);

function handleDelete(iraInvestment: IraInvestment) {
  emit('delete', iraInvestment);
}

function handleCreate(iraInvestmentTemplate: IraInvestmentTemplate) {
  emit('create', iraInvestmentTemplate);
}

function handleUpdate(iraInvestment: IraInvestment) {
  emit('update', iraInvestment);
}

function handleRemove(iraInvestment: IraInvestment) {
  emit('remove', iraInvestment)
}

</script>
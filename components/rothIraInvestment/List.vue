<template>
  <n-card title="Roth IRA Investment(s)">
    <template #header-extra>
      <RothIraInvestmentTemplatePicker @create="handleCreate"/>
    </template>
      <RothIraInvestmentListItem v-for="(rothIraInvestment, index) in rothIraInvestments" :rothIraInvestment="rothIraInvestment" :key="rothIraInvestment.id"
                      @delete="handleDelete" @update="handleUpdate" @create="handleCreate"
                      @remove="handleRemove"></RothIraInvestmentListItem>
  </n-card>

</template>
<script lang="ts" setup>
import type {RothIraInvestment, RothIraInvestmentTemplate} from "~/models/rothIraInvestment/RothIraInvestment";

interface Props {
  rothIraInvestments: RothIraInvestment[]
}

const props = defineProps<Props>()

const emit = defineEmits(['delete', 'update', 'create', 'remove']);

function handleDelete(rothIraInvestment: RothIraInvestment) {
  emit('delete', rothIraInvestment);
}

function handleCreate(rothIraInvestmentTemplate: RothIraInvestmentTemplate) {
  emit('create', rothIraInvestmentTemplate);
}

function handleUpdate(rothIraInvestment: RothIraInvestment) {
  emit('update', rothIraInvestment);
}

function handleRemove(rothIraInvestment: RothIraInvestment) {
  emit('remove', rothIraInvestment)
}

</script>
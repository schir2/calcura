<template>
  <n-card title="BrokerageInvestment(s)">
    <template #header-extra>
      <BrokerageInvestmentTemplatePicker @create="handleCreate"/>
    </template>
    <n-list>
      <BrokerageInvestmentListItem v-for="(brokerageInvestment, index) in brokerageInvestments" :brokerageInvestment="brokerageInvestment" :key="brokerageInvestment.id"
                      @delete="handleDelete" @update="handleUpdate" @create="handleCreate"
                      @remove="handleRemove"></BrokerageInvestmentListItem>
    </n-list>
  </n-card>

</template>
<script lang="ts" setup>
import type {BrokerageInvestment, BrokerageInvestmentTemplate} from "~/models/brokerageInvestment/BrokerageInvestment";

interface Props {
  brokerageInvestments: BrokerageInvestment[]
}

const props = defineProps<Props>()

const emit = defineEmits(['delete', 'update', 'create', 'remove']);

function handleDelete(brokerageInvestment: BrokerageInvestment) {
  emit('delete', brokerageInvestment);
}

function handleCreate(brokerageInvestmentTemplate: BrokerageInvestmentTemplate) {
  emit('create', brokerageInvestmentTemplate);
}

function handleUpdate(brokerageInvestment: BrokerageInvestment) {
  emit('update', brokerageInvestment);
}

function handleRemove(brokerageInvestment: BrokerageInvestment) {
  emit('remove', brokerageInvestment)
}

</script>
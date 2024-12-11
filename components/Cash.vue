
<template>
  <CommonCard color="secondary">
    <div class="flex justify-between align-middle">
      <h3 class="text-2xl">Cash {{ cash.id }}: {{ currentCashConfig.name }}</h3>
      <NButton iconLeft="mdi:delete" @click="deleteCash">Delete</NButton>
      <NButton v-if="isModified" iconLeft="mdi:history" @click="resetCash">Reset</NButton>
      <NButton v-if="isModified" iconLeft="mdi:content-save" @click="updateCash">Save</NButton>
    </div>
    <Form>
      <section>
        <div class="grid grid-cols-3 gap-3">
          <FormField :field="fieldMetadata.name" :model="cash"></FormField>
          <FormSelect :field="fieldMetadata.cashMaintenanceStrategy" :model="cash"></FormSelect>
          <FormField
              v-if="cash.cashMaintenanceStrategy === 'fixedCashReserve'"
              :field="fieldMetadata.reserveAmount"
              :model="cash"></FormField>
          <FormField
              v-if="cash.cashMaintenanceStrategy === 'variableCashReserve'"
              :field="fieldMetadata.reserveMonths"
              :model="cash"></FormField>
        </div>
      </section>
    </Form>
  </CommonCard>

</template>
<script setup lang="ts">
import { useEntityManager } from '~/composables/useEntityManager';
import { cashFields } from '~/forms/cashForm';
import type { Cash } from '~/models/cash/Cash';

interface Props {
  cash: Cash;
  showAdvancedOptions?: boolean;
}

const { showAdvancedOptions = false, cash } = defineProps<Props>();
const fieldMetadata = cashFields;

const emit = defineEmits(['deleteCash', 'updateCash']);

const {
  currentConfig: currentCashConfig,
  isModified,
  resetEntity: resetCash,
  deleteEntity: deleteCash,
  updateEntity: updateCash
} = useEntityManager<Cash>(cash, emit, 'cash');


</script>
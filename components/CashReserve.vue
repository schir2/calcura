
<template>
  <CommonCard color="secondary">
    <div class="flex justify-between align-middle">
      <h3 class="text-2xl">CashReserve: {{ currentCashReserveConfig.name }}</h3>
      <NButton iconLeft="mdi:delete" @click="deleteCashReserve">Delete</NButton>
      <NButton v-if="isModified" iconLeft="mdi:history" @click="resetCashReserve">Reset</NButton>
      <NButton v-if="isModified" iconLeft="mdi:content-save" @click="updateCashReserve">Save</NButton>
    </div>
    <Form>
      <section>
        <div class="grid grid-cols-3 gap-3">
          <FormField :field="fieldMetadata.name" :model="cashReserve"></FormField>
          <FormSelect :field="fieldMetadata.cashReserveStrategy" :model="cashReserve"></FormSelect>
          <FormField
              v-if="cashReserve.cashReserveStrategy === 'fixedCashReserve'"
              :field="fieldMetadata.reserveAmount"
              :model="cashReserve"></FormField>
          <FormField
              v-if="cashReserve.cashReserveStrategy === 'variableCashReserve'"
              :field="fieldMetadata.reserveMonths"
              :model="cashReserve"></FormField>
        </div>
      </section>
    </Form>
  </CommonCard>

</template>
<script setup lang="ts">
import { useEntityManager } from '~/composables/useEntityManager';
import { cashReserveFields } from '~/forms/cashReserveForm';
import type { CashReserve } from '~/models/cashReserve/CashReserve';

interface Props {
  cashReserve: CashReserve;
  showAdvancedOptions?: boolean;
}

const { showAdvancedOptions = false, cashReserve } = defineProps<Props>();
const fieldMetadata = cashReserveFields;

const emit = defineEmits(['deleteCashReserve', 'updateCashReserve']);

const {
  currentConfig: currentCashReserveConfig,
  isModified,
  resetEntity: resetCashReserve,
  deleteEntity: deleteCashReserve,
  updateEntity: updateCashReserve
} = useEntityManager<CashReserve>(cashReserve, emit, 'cashReserve');


</script>
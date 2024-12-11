<template>
  <CommonCard color="secondary">
    <div class="flex justify-between align-middle">
      <h3 class="text-2xl">Cash {{ cash.name }}</h3>
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
import Cash from "~/models/cash/Cash";
import {cashMaintenanceFields} from "~/forms/cashForm";

interface Props {
  cash: Cash
  showAdvancedOptions: boolean;
}

const {showAdvancedOptions = false, cash} = defineProps<Props>()
const fieldMetadata = cashMaintenanceFields


</script>
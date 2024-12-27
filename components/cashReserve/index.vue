
<template>
  <CommonCard color="secondary">
    <div class="flex justify-between align-middle">
      <h3 class="text-lg">Cash Reserve</h3>
      <n-button-group size="small">
        <NButton secondary round v-if="isModified" type="success" @click="updateCashReserve"><template #icon><Icon name="mdi:content-save"/></template>Save</NButton>
        <NButton secondary round v-if="isModified" type="warning" @click="resetCashReserve"><template #icon><Icon name="mdi:history"/></template>Reset</NButton>
        <NButton secondary round type="error" @click="deleteCashReserve"><template #icon><Icon name="mdi:delete"/></template>Delete</NButton>
      </n-button-group>
    </div>
    <Form>
          <FormTextInput :field="fieldMetadata.name" :modelValue="currentCashReserveConfig"></FormTextInput>
          <FormTextInput :field="fieldMetadata.initialAmount" :modelValue="currentCashReserveConfig"></FormTextInput>
          <FormSelect :field="fieldMetadata.cashReserveStrategy" :model="currentCashReserveConfig"></FormSelect>
          <FormTextInput
              v-if="currentCashReserveConfig.cashReserveStrategy === CashReserveStrategy.Fixed"
              :field="fieldMetadata.reserveAmount"
              :modelValue="currentCashReserveConfig"></FormTextInput>
          <FormTextInput
              v-if="currentCashReserveConfig.cashReserveStrategy === CashReserveStrategy.Variable"
              :field="fieldMetadata.reserveMonths"
              :modelValue="currentCashReserveConfig"></FormTextInput>
    </Form>
  </CommonCard>

</template>
<script setup lang="ts">
import {useEntityManager} from '~/composables/api/useEntityManager';
import {cashReserveForm} from '~/forms/cashReserveForm';
import {type CashReserve, CashReserveStrategy} from '~/models/cashReserve/CashReserve';

interface Props {
  cashReserve: CashReserve;
  showAdvancedOptions?: boolean;
}

const { showAdvancedOptions = false, cashReserve } = defineProps<Props>();
const fieldMetadata = cashReserveForm;

const emit = defineEmits(['deleteCashReserve', 'updateCashReserve']);

const {
  currentConfig: currentCashReserveConfig,
  isModified,
  resetEntity: resetCashReserve,
  deleteEntity: deleteCashReserve,
  updateEntity: updateCashReserve
} = useEntityManager<CashReserve>(cashReserve, emit, 'cashReserve');


</script>
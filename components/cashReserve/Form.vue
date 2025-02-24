<template>
  <n-card role="dialog" class="max-w-6xl" :bordered="true">
    <template #header>
      <h3 class="text-2xl">Cash Reserve: {{ modelRef.name }}</h3>
    </template>

    <template #default>
      <n-form ref="formRef" :model="modelRef" :rules="rules">
        <section class="grid grid-cols-3 gap-3">
          <n-form-item path="name" label="Cash Reserve Name">
            <n-input v-model:value="modelRef.name" placeholder="Enter cash reserve name"/>
          </n-form-item>

          <n-form-item path="initialAmount" label="Initial Amount">
            <n-input-number class="w-full" v-model:value="modelRef.initialAmount"
                            placeholder="Enter the amount currently in your cash reserve"/>
          </n-form-item>

          <n-form-item path="cashReserveStrategy" label="Cash Reserve Strategy">
            <n-select v-model:value="modelRef.cashReserveStrategy" :options="[
            { label: 'Fixed Cash Reserve', value: 'fixed' },
            { label: 'Variable Cash Reserve', value: 'variable' }
          ]" placeholder="Select cash reserve strategy"/>
          </n-form-item>
        </section>

        <n-form-item path="reserveAmount" label="Reserve Amount">
          <n-input-number class="w-full" v-model:value="modelRef.reserveAmount" :precision="2"
                          placeholder="Enter reserve amount"/>
        </n-form-item>

        <n-form-item path="reserveMonths" label="Reserve Months">
          <n-input-number class="w-full" v-model:value="modelRef.reserveMonths" :precision="2"
                          placeholder="Enter reserve months"/>
        </n-form-item>
      </n-form>
    </template>

    <template #action>
      <FormActionButtons :mode="mode" @update="handleUpdate"
                         @create="handleCreate" @cancel="handleCancel"/>
    </template>
  </n-card>
</template>

<script lang="ts" setup>
import type {CashReserve} from "~/types/CashReserve";

interface Props {
  initialValues: Partial<CashReserve>;
  mode: 'create' | 'edit'
}

const props = defineProps<Props>();
const emit = defineEmits(["update", "cancel", "create"]);

const {formRef, modelRef, rules, handleCreate, handleUpdate, handleCancel} =
    useCrudFormWithValidation(props.initialValues, emit, useCashReserveValidation);


</script>
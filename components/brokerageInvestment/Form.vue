<template>
  <n-card role="dialog" class="max-w-2xl" :bordered="true">
    <template #header>
      <h3 class="text-2xl">BrokerageInvestment: {{ brokerageInvestmentPartial.name }}</h3>
    </template>

    <template #default>
      <n-form>
        <n-form-item path="name" :label="brokerageInvestmentForm.name.label" v-bind="formFields.name.props">
          <n-input v-model:value="formFields.name.value"/>
        </n-form-item>
        <n-form-item path="reserveAmount" :label="brokerageInvestmentForm.initialBalance.label" v-bind="formFields.initialBalance.props">
          <n-input-number class="w-full" v-model:value="formFields.initialBalance.value">
            <template #prefix><n-tag size="small">$</n-tag></template>
          </n-input-number>
        </n-form-item>
        <n-form-item path="growthRate" :label="brokerageInvestmentForm.growthRate.label" v-bind="formFields.growthRate.props">
          <div class="flex flex-col w-full gap-3">
            <n-slider v-model:value="formFields.growthRate.value"/>
            <n-input-number size="small" :placeholder="brokerageInvestmentForm.growthRate.placeholder" v-model:value="formFields.growthRate.value">
              <template #prefix><n-tag size="small">%</n-tag></template>
            </n-input-number>
          </div>
        </n-form-item>
        <n-form-item path="contributionStrategy" :label="brokerageInvestmentForm.contributionStrategy.label"  v-bind="formFields.contributionStrategy.props">
          <n-radio-group v-model:value="formFields.contributionStrategy.value">
            <n-radio-button v-for="option in brokerageInvestmentForm.contributionStrategy.options" :key="option.value" :value="option.value" :label="option.label" />
          </n-radio-group>
        </n-form-item>
        <n-form-item class="w-full" v-if="formFields.contributionStrategy.value === 'percentage_of_income'" path="contributionPercentage" :label="brokerageInvestmentForm.contributionPercentage.label" v-bind="formFields.contributionPercentage.props">
          <div class="flex flex-col w-full gap-3">
            <n-slider v-model:value="formFields.contributionPercentage.value"></n-slider>
            <n-input-number v-model:value="formFields.contributionPercentage.value">
              <template #prefix><n-tag size="small">%</n-tag></template>
            </n-input-number>
          </div>
        </n-form-item>
        <n-form-item v-if="formFields.contributionStrategy.value === 'fixed'" path="contributionFixedAmount" :label="brokerageInvestmentForm.contributionFixedAmount.label" v-bind="formFields.contributionFixedAmount.props">
          <n-input-number class="w-full" v-model:value="formFields.contributionFixedAmount.value"><template #prefix><n-tag size="small">$</n-tag></template></n-input-number>
        </n-form-item>
      </n-form>
    </template>

    <template #action>
      <FormActionButtons :mode="mode" @update="handleUpdate" @create="handleCreate" @cancel="handleCancel"/>
    </template>
  </n-card>
</template>

<script lang="ts" setup>
import {brokerageInvestmentForm, brokerageInvestmentFormSchema} from "~/forms/brokerageInvestmentForm";
import {useForm} from "vee-validate";
import type {BrokerageInvestment} from "~/models/brokerageInvestment/BrokerageInvestment";
import {useFieldHelpers} from "~/composables/useFieldHelpers";
import {cashReserveForm} from "~/forms/cashReserveForm";

interface Props {
  brokerageInvestmentPartial: Partial<BrokerageInvestment>;
  mode: 'create' | 'edit'
}

const props = defineProps<Props>();
const emit = defineEmits(["update", "cancel", "create"]);

const {defineField, values, errors, handleSubmit, meta} = useForm({
  validationSchema: brokerageInvestmentFormSchema,
  initialValues: props.brokerageInvestmentPartial,
});

const formFields = ref(useFieldHelpers(brokerageInvestmentForm, defineField))


function handleCreate() {
  emit('create', values)

}

function handleCancel() {
  emit('cancel')
}

function handleUpdate() {
  emit('update', values)
}
</script>
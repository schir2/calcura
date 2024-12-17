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
        <n-form-item path="growthRate" :label="brokerageInvestmentForm.growthRate.label" v-bind="formFields.growthRate.props">
          <n-input-number  v-model:value="formFields.growthRate.value"/>
        </n-form-item>
        <n-form-item path="reserveAmount" :label="brokerageInvestmentForm.initialBalance.label" v-bind="formFields.initialBalance.props">
          <n-input-number v-model:value="formFields.initialBalance.value"/>
        </n-form-item>
        <n-form-item path="contributionPercentage" :label="brokerageInvestmentForm.contributionPercentage.label" v-bind="formFields.contributionPercentage.props">
          <n-input-number v-model:value="formFields.contributionPercentage.value"/>
        </n-form-item>
        <n-form-item path="contributionFixedAmount" :label="brokerageInvestmentForm.contributionFixedAmount.label" v-bind="formFields.contributionFixedAmount.props">
          <n-input-number v-model:value="formFields.contributionFixedAmount.value"/>
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
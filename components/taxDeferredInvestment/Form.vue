<template>
  <n-card role="dialog" class="max-w-2xl" :bordered="true">
    <template #header>
      <h3 class="text-2xl">TaxDeferredInvestment: {{ taxDeferredInvestmentPartial.name }}</h3>
    </template>

    <template #default>
      <n-form>
        <n-form-item path="name" :label="taxDeferredInvestmentForm.name.label" v-bind="formFields.name.props">
          <n-input v-model:value="formFields.name.value"/>
        </n-form-item>
        <n-form-item path="growthRate" :label="taxDeferredInvestmentForm.growthRate.label" v-bind="formFields.growthRate.props">
          <n-input-number v-model:value="formFields.growthRate.value"/>
        </n-form-item>
        <n-form-item path="initialBalance" :label="taxDeferredInvestmentForm.initialBalance.label" v-bind="formFields.initialBalance.props">
          <n-input-number v-model:value="formFields.initialBalance.value"/>
        </n-form-item>
        <n-form-item path="electiveContributionPercentage" :label="taxDeferredInvestmentForm.electiveContributionPercentage.label" v-bind="formFields.electiveContributionPercentage.props">
          <n-space vertical class="w-full">
            <n-slider v-model:value="formFields.electiveContributionPercentage.value" :min="0" :max="20" :marks="{3: 'Medium', 6:'High'}"/>
          </n-space>
        </n-form-item>
        <n-form-item path="electiveContributionFixedAmount" :label="taxDeferredInvestmentForm.electiveContributionFixedAmount.label" v-bind="formFields.electiveContributionFixedAmount.props">
          <n-input-number v-model:value="formFields.electiveContributionFixedAmount.value"/>
        </n-form-item>
        <n-form-item path="employerContributes" :label="taxDeferredInvestmentForm.employerContributes.label" v-bind="formFields.employerContributes.props">
          <n-switch v-model:value="formFields.employerContributes.value"/>
        </n-form-item>
        <n-form-item path="employerContributionStrategy" :label="taxDeferredInvestmentForm.employerContributionStrategy.label" v-bind="formFields.employerContributionStrategy.props">
          <n-select v-model:value="formFields.employerContributionStrategy.value" :options="taxDeferredInvestmentForm.employerContributionStrategy.options"/>
        </n-form-item>
        <n-form-item path="employerCompensationMatchPercentage" :label="taxDeferredInvestmentForm.employerCompensationMatchPercentage.label" v-bind="formFields.employerCompensationMatchPercentage.props">
          <n-input-number v-model:value="formFields.employerCompensationMatchPercentage.value"/>
        </n-form-item>
        <n-form-item path="employerContributionFixedAmount" :label="taxDeferredInvestmentForm.employerContributionFixedAmount.label" v-bind="formFields.employerContributionFixedAmount.props">
          <n-input-number v-model:value="formFields.employerContributionFixedAmount.value"/>
        </n-form-item>
        <n-form-item path="employerMatchPercentage" :label="taxDeferredInvestmentForm.employerMatchPercentage.label" v-bind="formFields.employerMatchPercentage.props">
          <n-input-number v-model:value="formFields.employerMatchPercentage.value"/>
        </n-form-item>
        <n-form-item path="employerMatchPercentageLimit" :label="taxDeferredInvestmentForm.employerMatchPercentageLimit.label" v-bind="formFields.employerMatchPercentageLimit.props">
          <n-input-number v-model:value="formFields.employerMatchPercentageLimit.value"/>
        </n-form-item>

      </n-form>
    </template>

    <template #action>
      <FormActionButtons :mode="mode" @update="handleUpdate" @create="handleCreate" @cancel="handleCancel"/>
    </template>
  </n-card>
</template>

<script lang="ts" setup>
import {taxDeferredInvestmentForm, taxDeferredInvestmentFormSchema} from "~/forms/taxDeferredInvestmentForm";
import {useForm} from "vee-validate";
import type {TaxDeferredInvestment} from "~/models/taxDeferredInvestment/TaxDeferredInvestment";
import {useFieldHelpers} from "~/composables/useFieldHelpers";

interface Props {
  taxDeferredInvestmentPartial: Partial<TaxDeferredInvestment>;
  mode: 'create' | 'edit'
}

const props = defineProps<Props>();
const emit = defineEmits(["update", "cancel", "create"]);

const {defineField, values, errors, handleSubmit, meta} = useForm({
  validationSchema: taxDeferredInvestmentFormSchema,
  initialValues: props.taxDeferredInvestmentPartial,
});

const formFields = ref(useFieldHelpers(taxDeferredInvestmentForm, defineField))


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
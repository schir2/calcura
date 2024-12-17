<template>
  <n-card role="dialog" class="max-w-2xl" :bordered="true">
    <template #header>
      <h3 class="text-2xl">TaxDeferredInvestment: {{ taxDeferredInvestmentPartial.name }}</h3>
    </template>

    <template #default>
      <n-form>
        <n-form-item path="name" label="Name" v-bind="formFields.name.props">
          <n-input v-model:value="formFields.name.value"/>
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
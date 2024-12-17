<template>
  <n-card role="dialog" class="max-w-2xl" :bordered="true">
    <template #header>
      <h3 class="text-2xl">IraInvestment: {{ iraInvestmentPartial.name }}</h3>
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
import {iraInvestmentForm, iraInvestmentFormSchema} from "~/forms/iraInvestmentForm";
import {useForm} from "vee-validate";
import type {IraInvestment} from "~/models/iraInvestment/IraInvestment";
import {useFieldHelpers} from "~/composables/useFieldHelpers";

interface Props {
  iraInvestmentPartial: Partial<IraInvestment>;
  mode: 'create' | 'edit'
}

const props = defineProps<Props>();
const emit = defineEmits(["update", "cancel", "create"]);

const {defineField, values, errors, handleSubmit, meta} = useForm({
  validationSchema: iraInvestmentFormSchema,
  initialValues: props.iraInvestmentPartial,
});

const formFields = ref(useFieldHelpers(iraInvestmentForm, defineField))

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
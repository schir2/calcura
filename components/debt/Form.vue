<template>
  <n-card role="dialog" class="max-w-2xl" :bordered="true">
    <template #header>
      <h3 class="text-2xl">Debt: {{ debtPartial.name }}</h3>
    </template>

    <template #default>
      <n-form>
        <n-form-item path="name" v-bind="formFields.name.props">
          <n-input v-model:value="formFields.name.value"/>
        </n-form-item>
        <n-form-item path="principal" v-bind="formFields.principal.props">
          <n-input-number v-model:value="formFields.principal.value"/>
        </n-form-item>
        <n-form-item path="interestRate" v-bind="formFields.interestRate.props">
          <n-space vertical class="w-full">
            <n-slider v-model:value="formFields.interestRate.value" :min="0" :max="50" :marks="{5: 'Medium', 15:'High', 30:'Extreme'}"/>
            <n-input-number v-model:value="formFields.interestRate.value" size="small"/>
          </n-space>
        </n-form-item>
        <n-form-item>
        </n-form-item>

      </n-form>
    </template>

    <template #action>
      <FormActionButtons :mode="mode" @update="handleUpdate" @create="handleCreate" @cancel="handleCancel"/>
    </template>
  </n-card>
</template>

<script lang="ts" setup>
import {debtForm, debtFormSchema} from "~/forms/debtForm";
import {useForm} from "vee-validate";
import type {Debt} from "~/models/debt/Debt";
import {useFieldHelpers} from "~/composables/useFieldHelpers";

interface Props {
  debtPartial: Partial<Debt>;
  mode: 'create' | 'edit'
}

const props = defineProps<Props>();
const emit = defineEmits(["update", "cancel", "create"]);

const {defineField, values, errors, handleSubmit, meta} = useForm({
  validationSchema: debtFormSchema,
  initialValues: props.debtPartial,
});


const formFields = ref(useFieldHelpers(debtForm, defineField))


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
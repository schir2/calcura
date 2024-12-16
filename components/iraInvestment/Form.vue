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
      <n-button-group>
        <n-button secondary round v-if="mode ==='edit'" type="success" @click="handleUpdate">
          <template #icon>
            <Icon name="mdi:content-save"/>
          </template>
          <span>Save</span>
        </n-button>
        <n-button secondary round v-if="mode==='edit'" type="warning" @click="handleCreate">
          <template #icon>
            <Icon name="mdi:content-duplicate"/>
          </template>
          <span>Duplicate</span>
        </n-button>
        <n-button secondary round v-if="mode==='create'" type="success" @click="handleCreate">
          <template #icon>
            <Icon name="mdi:content-save"/>
          </template>
          <span>Create</span>
        </n-button>
        <n-button secondary round type="error" @click="handleCancel">
          <template #icon>
            <Icon name="mdi:close"/>
          </template>
          Cancel
        </n-button>
      </n-button-group>
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
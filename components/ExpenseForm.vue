<template>
  <n-card role="dialog" class="max-w-2xl" :bordered="true">
    <template #header>
      <h3 class="text-2xl">Expense: {{ expensePartial.name }}</h3>
    </template>

    <template #default>
      <n-form>
        <n-form-item path="name" label="Name" v-bind="nameProps">
          <n-input v-model:value="name"/>
        </n-form-item>

        <n-form-item path="amount" label="Amount" v-bind="amountProps">
          <n-input-number v-model:value="amount"/>
        </n-form-item>

        <n-form-item path="expenseType" label="Expense Type" v-bind="expenseTypeProps">
          <n-select v-model:value="expenseType" :options="expenseFields.expenseType.options"/>
        </n-form-item>

        <n-form-item path="frequency" label="Frequency" v-bind="frequencyProps">
          <n-select v-model:value="frequency" :options="expenseFields.frequency.options"/>
        </n-form-item>

        <n-form-item path="isEssential" label="Essential?" v-bind="isEssentialProps">
          <n-switch v-model:value="isEssential"/>
        </n-form-item>

        <n-form-item path="isTaxDeductible" label="Growth Rate" v-bind="isTaxDeductibleProps">
          <n-switch v-model:value="isTaxDeductible" suffix="%"/>
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
import {expenseFields, expenseFormSchema} from "~/forms/expenseForm";
import {useForm} from "vee-validate";
import type {Expense} from "~/models/expense/Expense";

interface Props {
  expensePartial: Partial<Expense>;
  mode: 'create' | 'edit'
}

const props = defineProps<Props>();
const emit = defineEmits(["update", "cancel", "create"]);

const {defineField, values, errors, handleSubmit, meta} = useForm({
  validationSchema: expenseFormSchema,
  initialValues: props.expensePartial,
});


const naiveConfig = (state) => ({
  props: {
    validationStatus: state.errors[0] ? "error" : undefined,
    feedback: state.errors[0],
  },
});


const [name, nameProps] = defineField("name", naiveConfig);
const [amount, amountProps] = defineField("amount", naiveConfig);
const [frequency, frequencyProps] = defineField("frequency", naiveConfig);
const [expenseType, expenseTypeProps] = defineField("expenseType", naiveConfig);
const [isEssential, isEssentialProps] = defineField("isEssential", naiveConfig);
const [isTaxDeductible, isTaxDeductibleProps] = defineField("isTaxDeductible", naiveConfig);


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
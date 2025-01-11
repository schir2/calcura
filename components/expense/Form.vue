<template>
  <n-card role="dialog" class="max-w-2xl" :bordered="true">
    <template #header>
      <h3 class="text-2xl">Expense: {{ expensePartial.name }}</h3>
    </template>

    <template #default>
      <n-form>
        <section class="grid grid-cols-3 gap-3">
          <n-form-item path="name" :label="expenseForm.name.label" v-bind="nameProps">
            <n-input v-model:value="name"/>
          </n-form-item>

          <n-form-item path="amount" :label="expenseForm.amount.label" v-bind="amountProps">
            <n-input-number v-model:value="amount"/>
          </n-form-item>


          <n-form-item path="growthRate" :label="expenseForm.growthRate.label" v-bind="growthRateProps">
            <n-space vertical class="w-full">
              <n-input-number class="w-full" v-model:value="growthRate" :disabled="growsWithInflation"/>
            </n-space>
          </n-form-item>
        </section>
        <n-form-item path="frequency" :label="expenseForm.frequency.label" v-bind="frequencyProps">
          <n-radio-group v-model:value="frequency">
            <n-radio-button v-for="option in expenseForm.frequency.options" :key="option.value" :label="option.label"
                            :value="option.value"/>
          </n-radio-group>
        </n-form-item>
        <section class="grid grid-cols-4 gap-3">
          <n-form-item path="expenseType" :label="expenseForm.expenseType.label" v-bind="expenseTypeProps">
            <n-radio-group v-model:value="expenseType">
              <n-radio-button v-for="option in expenseForm.expenseType.options" :key="option.value"
                              :label="option.label"
                              :value="option.value"/>
            </n-radio-group>
          </n-form-item>
          <n-form-item class="justify-center" path="isEssential" :label="expenseForm.isEssential.label"
                       v-bind="isEssentialProps">
            <n-switch v-model:value="isEssential"/>
          </n-form-item>

          <n-form-item path="isTaxDeductible" :label="expenseForm.isTaxDeductible.label" v-bind="isTaxDeductibleProps">
            <n-switch v-model:value="isTaxDeductible" suffix="%"/>
          </n-form-item>

          <n-form-item path="growsWithInflation" :label="expenseForm.growsWithInflation.label"
                       v-bind="growsWithInflationProps">
            <n-switch v-model:value="growsWithInflation" suffix="%"/>
          </n-form-item>
        </section>
      </n-form>
    </template>
    <template #footer>

      <n-statistic class="text-end">${{ $humanize.intComma(getAnnualAmount(amount ?? 0, frequency)) }}/year</n-statistic>
    </template>

    <template #action>
      <FormActionButtons :mode="mode" @update="handleUpdate" @create="handleCreate" @cancel="handleCancel"/>
    </template>
  </n-card>
</template>

<script lang="ts" setup>
import {expenseForm, expenseFormSchema} from "~/forms/expenseForm";
import {useForm} from "vee-validate";
import type {Expense} from "~/models/expense/Expense";
import {naiveConfig} from "~/utils/schemaUtils";
import {getAnnualAmount} from "~/utils";

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

const [name, nameProps] = defineField('name', naiveConfig)
const [amount, amountProps] = defineField('amount', naiveConfig)
const [expenseType, expenseTypeProps] = defineField('expenseType', naiveConfig)
const [frequency, frequencyProps] = defineField('frequency', naiveConfig)
const [isEssential, isEssentialProps] = defineField('isEssential', naiveConfig)
const [isTaxDeductible, isTaxDeductibleProps] = defineField('isTaxDeductible', naiveConfig)
const [growsWithInflation, growsWithInflationProps] = defineField('growsWithInflation', naiveConfig)
const [growthRate, growthRateProps] = defineField('growthRate', naiveConfig)


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
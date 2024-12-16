<template>
  <n-card role="dialog" class="max-w-2xl" :bordered="true">
    <template #header>
      <h3 class="text-2xl">CashReserve: {{ cashReservePartial.name }}</h3>
    </template>

    <template #default>
      <n-form>
        <n-form-item path="name" label="Name" v-bind="nameProps">
          <n-input v-model:value="name"/>
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
import {cashReserveFormSchema} from "~/forms/cashReserveForm";
import {useForm} from "vee-validate";
import type {CashReserve} from "~/models/cashReserve/CashReserve";

interface Props {
  cashReservePartial: Partial<CashReserve>;
  mode: 'create' | 'edit'
}

const props = defineProps<Props>();
const emit = defineEmits(["update", "cancel", "create"]);

const {defineField, values, errors, handleSubmit, meta} = useForm({
  validationSchema: cashReserveFormSchema,
  initialValues: props.cashReservePartial,
});


const naiveConfig = (state) => ({
  props: {
    validationStatus: state.errors[0] ? "error" : undefined,
    feedback: state.errors[0],
  },
});


const [name, nameProps] = defineField("name", naiveConfig);
const [principal, principalProps] = defineField("principal", naiveConfig);
const [interestRate, interestRateProps] = defineField("interestRate", naiveConfig);
const [paymentMinimum, paymentMinimumProps] = defineField("paymentMinimum", naiveConfig);
const [paymentStrategy, paymentStrategyProps] = defineField("paymentStrategy", naiveConfig);
const [paymentFixedAmount, paymentFixedAmountProps] = defineField("paymentFixedAmount", naiveConfig);
const [paymentPercentage, paymentPercentageProps] = defineField("paymentPercentage", naiveConfig);


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
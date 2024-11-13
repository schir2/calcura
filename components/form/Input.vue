<script setup lang="ts">
import {Field, type RuleExpression} from "vee-validate";

export type InputType =
    | 'text'
    | 'password'
    | 'email'
    | 'number'
    | 'url'
    | 'date'
    | 'datetime-local'
    | 'month'
    | 'week'
    | 'time'
    | 'search'
    | 'tel'
    | 'checkbox'
    | 'radio'

interface Props {
  type?: InputType
  modelValue: string | number
  name: string
  label?: string
  placeholder?: string
  readonly?: boolean
  disabled?: boolean
  rules?: RuleExpression<unknown>
}

const {
  type = 'text',
  modelValue = '',
  name,
  label,
  placeholder,
  readonly,
  disabled,
  rules,
} = defineProps<Props>()

const emit = defineEmits(['update:modelValue']);

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};

</script>

<template>
  <label v-if="label">{{ label }}</label>
  <Field
      class="border rounded shadow px-3 py-1.5 text-skin-base bg-skin-base focus:outline-none focus:ring-2 focus:ring-skin-accent w-full"
      :type="type"
      :name="name"
      :value="modelValue"
      :placeholder="placeholder"
      :readonly="readonly"
      :disabled="disabled"
      :rules="rules"
      @input="onInput"
      validate-on-input
  />
  <ErrorMessage :name="name" class="text-skin-error text-sm mt-1" />
</template>
<script setup lang="ts">
import {Field} from "vee-validate";

export type InputType = 'text' | 'password' | 'email' | 'number' | 'url' | 'date' | 'datetime-local' | 'month' | 'week' | 'time' | 'search' | 'tel' | 'checkbox' | 'radio'

interface Props {
  type?: InputType
  modelValue: string | number | boolean
  name: string
  label?: string
  helpText?: string
  placeholder?: string
  readonly?: boolean
  disabled?: boolean
  rules?: any
}

const {  type = 'text',  modelValue = '',  name,  label,  helpText,  placeholder,  readonly,  disabled,  rules,} = defineProps<Props>()

const emit = defineEmits(['update:modelValue']);

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};

</script>

<template>
  <div>
    <FormLabel v-if="label" :label="label"/>
    <Field
        class="border rounded shadow px-3 py-1.5 text-skin-base bg-skin-base focus:outline-none focus:ring-2 focus:ring-skin-accent w-full"
        :type="type"
        :name="name"
        :value="modelValue"
        :placeholder="placeholder"
        :helpText="helpText"
        :readonly="readonly"
        :disabled="disabled"
        :rules="rules"
        @input="onInput"
        validate-on-input
    />
  </div>
  <FormHelpText v-if="helpText" :helpText="helpText"></FormHelpText>
  <ErrorMessage :name="name" class="text-skin-error text-sm mt-1"/>
</template>
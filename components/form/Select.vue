<script setup lang="ts">
import {Field, type RuleExpression} from "vee-validate";
import * as yup from "yup";

export interface SelectOption {
  label: string,
  value: string | number
}

interface Props {
  options: SelectOption[] | Record<string, SelectOption>
  modelValue: string | number
  name: string
  label?: string
  help_text?: string
  readonly?: boolean
  disabled?: boolean
  rules?: any
}

const processOptions = (options: SelectOption[] | Record<string, SelectOption>): SelectOption[] => {
  if (!Array.isArray(options)) {
    return Object.values(options).sort((a, b) => a.label.localeCompare(b.label));
  }
  return options.sort((a, b) => a.label.localeCompare(b.label));
};

const {
  options = [], name, label, help_text, readonly, disabled, rules
} = defineProps<Props>()
const formattedOptions = computed(() => processOptions(options));

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
        as="select"
        :name="name"
        :model-value="modelValue"
        :readonly="readonly"
        :disabled="disabled"
        :rules="rules"
        @input="onInput"
    >
      <option v-for="(option, index) in formattedOptions" :value="option.value" :key="index">{{ option.label }}</option>
    </Field>
  </div>

</template>
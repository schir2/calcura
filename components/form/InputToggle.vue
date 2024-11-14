<script setup lang="ts">
import {Field, type RuleExpression} from "vee-validate";

interface Props {
  modelValue: boolean
  name: string
  label?: string
  readonly?: boolean
  disabled?: boolean
  rules?: RuleExpression<unknown>
}

const {
  modelValue = '',
  name,
  label,
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

  <label class="inline-flex items-center cursor-pointer">
<!--    TODO Convert this to my style -->
    <Field
        type="checkbox"
        :name="name"
        :value="modelValue"
        :readonly="readonly"
        :disabled="disabled"
        :rules="rules"
        @input="onInput"
        validate-on-input
        class="sr-only peer"/>
    <div
        class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
    <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Toggle me</span>
  </label>

  <ErrorMessage :name="name" class="text-skin-error text-sm mt-1"/>
</template>
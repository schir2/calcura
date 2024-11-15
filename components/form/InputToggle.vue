<script setup lang="ts">
import {Field, type RuleExpression} from "vee-validate";
import * as yup from "yup";

interface Props {
  modelValue: boolean
  name: string
  label?: string
  readonly?: boolean
  disabled?: boolean
  helpText?: string
  rules?: any
}

const {
  modelValue,
  name,
  label,
  helpText,
  readonly,
  disabled,
  rules,
} = defineProps<Props>()

const emit = defineEmits(['update:modelValue']);

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.checked);
};

</script>

<template>
  <div>
    <FormLabel v-if="label" :label="label"></FormLabel>
    <div>
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
            class="sr-only peer"/>
        <div
            class="relative w-11 h-6 bg-skin-primary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-skin-accent rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-skin-primary after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-skin-base after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-skin-accent"></div>
        <span class="ms-3 text-sm font-medium text-skin-base">{{ helpText }}</span>
      </label>
    </div>
    <FormHelpText v-if="helpText" :helpText="helpText"/>
    <ErrorMessage :name="name" class="text-skin-error text-sm mt-1"/>
  </div>
</template>
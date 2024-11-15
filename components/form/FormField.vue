<template>
  <div>

    <FormLabel v-if="field.label" :label="field.label"/>
    <Field
        :id="field.name"
        :name="field.name"
        :type="field.type || 'text'"
        v-model="modelValue"
        :placeholder="field.placeholder"
        :disabled="field.disabled"
        :readonly="field.readonly"
        :rules="field.rules"
        v-bind="additionalAttrs"
        class="border rounded shadow px-3 py-1.5 text-skin-base bg-skin-base focus:outline-none focus:ring-2 focus:ring-skin-accent w-full"
    />
    <FormHelpText v-if="field.helpText" :helpText="field.helpText"></FormHelpText>
    <ErrorMessage :name="field.name" class="text-skin-error text-sm mt-1"/>
  </div>
</template>

<script setup lang="ts">
import {computed, defineProps} from 'vue';
import {ErrorMessage, Field as VeeField} from 'vee-validate';
import type {Field as FieldType} from '~/interfaces/Field';

interface Props<T = any> {
  field: FieldType<T>;
}

const props = defineProps<Props>();

// Use the VeeField component from vee-validate
const Field = VeeField;

// Two-way data binding with field.value
const modelValue = computed({
  get: () => props.field.value ?? props.field.defaultValue ?? '',
  set: (val) => {
    props.field.value = val;
  },
});

// Additional attributes for the input field (if any)
const additionalAttrs = computed(() => {
  const attrs: Record<string, any> = {};
  if (props.field.type === 'number') {
    attrs.step = 'any';
  }
  // Add other attributes as needed
  return attrs;
});
</script>

<style scoped>
</style>

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
    <FormHelpText class="block" v-if="field.helpText" :helpText="field.helpText"></FormHelpText>
    <ErrorMessage :name="field.name" class="block text-skin-error text-sm mt-1"/>
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

const additionalAttrs = computed(() => {
  const attrs: Record<string, any> = {};
  if (props.field.type === 'number') {
    attrs.step = 'any';
  }
  const rules = props.field.rules
  if (rules && typeof rules.describe === 'function') {
    const description = rules.describe();
    if (description.tests) {
      description.tests.forEach((test: any) => {
        switch (test.name) {
          case 'min':
            switch (props.field.type) {
              case 'number':
                attrs.min = test.params.min;
                break;
              case 'text':
                attrs.minLength = test.params.min;
                break
            }
            break

          case 'max':
            switch (props.field.type) {
              case 'number':
                attrs.max = test.params.max;
                break;
              case 'text':
                attrs.maxLength = test.params.max;
                break
            }
            break
        }
      })
    }
  }
  return attrs;
});


</script>

<style scoped>
</style>

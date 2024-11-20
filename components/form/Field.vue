<template>
  <div>

    <FormLabel v-if="field.label" :label="field.label"/>
    <Field v-if="field.type !== 'select'"
           :id="field.name"
           :name="field.name"
           :type="field.type || 'text'"
           v-model="model[field.name]"
           :placeholder="field.placeholder"
           :disabled="field.disabled"
           :readonly="field.readonly"
           :rules="field.rules"
           v-bind="additionalAttrs"
           class="border border-skin-base rounded-md shadow px-3 py-1.5 text-skin-base bg-skin-base focus:outline-none focus:ring-2 focus:ring-skin-primary w-full
           hover:bg-skin-muted hover:ring-1  hover:ring-skin-primary
"
    />
    <FormHelpText v-if="field.helpText" :helpText="field.helpText"></FormHelpText>
    <ErrorMessage :name="field.name" class="block text-skin-error text-sm mt-1"/>
  </div>
</template>
<script setup lang="ts">
import {ErrorMessage, Field} from 'vee-validate';
import type {FieldData} from '~/interfaces/FieldData';

interface Props<T = any> {
  field: FieldData<T>;
  model: Record<string, any>;
}

const props = defineProps<Props>();

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
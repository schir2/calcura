<template>
  <div class="flex flex-col gap-1">

    <FormLabel v-if="field.label" :label="field.label"/>
    <n-input v-if="field.inputType !== 'select'"
             :name="field.name"
             :type="field.inputType || 'text'"
             v-model:value="value"
             :placeholder="field.placeholder"
             :disabled="field.disabled"
             :readonly="field.readonly"
             v-bind="additionalAttrs"
    />
    <FormHelpText v-if="field.helpText" :helpText="field.helpText"></FormHelpText>
    <ErrorMessage :name="field.name" class="block text-skin-error text-sm mt-1"/>
  </div>
</template>
<script setup lang="ts">
import {ErrorMessage} from 'vee-validate';
import type {FieldData} from '~/interfaces/FieldData';

interface Props<T = any> {
  field: FieldData<T>;
  model: Record<string, any>;
}

const props = defineProps<Props>();
const {value, errorMessage} = useField(props.field.name, props.field.rules, {
  initialValue: props.model[props.field.name]
})

const additionalAttrs = computed(() => {
  const attrs: Record<string, any> = {};
  if (props.field.inputType === 'number') {
    attrs.step = 'any';
  }
  const rules = props.field.rules
  if (rules && typeof rules.describe === 'function') {
    const description = rules.describe();
    if (description.tests) {
      description.tests.forEach((test: any) => {
        switch (test.name) {
          case 'min':
            switch (props.field.inputType) {
              case 'number':
                attrs.min = test.params.min;
                break;
              case 'text':
                attrs.minLength = test.params.min;
                break
            }
            break

          case 'max':
            switch (props.field.inputType) {
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
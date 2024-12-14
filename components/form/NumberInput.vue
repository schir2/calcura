<template>
  <div class="flex flex-col gap-1">

    <FormLabel v-if="field.label" :label="field.label"/>
    <n-input-number v-if="field.inputType !== 'select'"
                    :name="field.name"
                    v-model:value="value"
                    :placeholder="field.placeholder"
                    :disabled="field.disabled"
                    :readonly="field.readonly"
                    :min="min"
                    :max="max"
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
  type?: 'number' | 'money'
}

const props = defineProps<Props>();
const {value} = useField(props.field.name, props.field.rules, {
  initialValue: props.model[props.field.name]
})

function getMinMaxFromRules(rules): Record<'min' | 'max', undefined | number> {
  let min = undefined;
  let max = undefined;
  if (rules && typeof rules.describe === 'function') {
    const description = rules.describe();
    if (description.tests) {
      description.tests.forEach((test: any) => {
        switch (test.name) {
          case 'min':
            min = test.params.min;
            break;
          case 'max':
            max = test.params.max;
            break;
        }
      })
    }
  }
  return {min: min, max: max};
}

const {min, max} = getMinMaxFromRules(props.field.rules);
console.log(min, max)
</script>
<template>
  <div>

    <FormLabel v-if="field.label" :label="field.label"/>
    <Field v-if="field.type !== 'select'"
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
    <Field v-else-if="field.type==='select'"
           class="border rounded shadow px-3 py-1.5 text-skin-base bg-skin-base focus:outline-none focus:ring-2 focus:ring-skin-accent w-full"
           as="select"
           :id="field.name"
           :name="field.name"
           :v-model="modelValue"
           :readonly="field.readonly"
           :disabled="field.disabled"
           :rules="field.rules"
    >
      <option v-for="(option, index) in formattedOptions" :value="option.value" :key="index">{{ option.label }}</option>
    </Field>
    <FormHelpText class="block" v-if="field.helpText" :helpText="field.helpText"></FormHelpText>
    <ErrorMessage :name="field.name" class="block text-skin-error text-sm mt-1"/>
  </div>
</template>
<script setup lang="ts">
import {computed, defineProps} from 'vue';
import {ErrorMessage, Field} from 'vee-validate';
import type {FieldData} from '~/interfaces/FieldData';
import type {SelectOption} from "~/components/form/Select.vue";

interface Props<T = any> {
  field: FieldData<T>;
}

const props = defineProps<Props>();

const modelValue = computed({
  get: () => props.field.value ?? props.field.defaultValue ?? '',
  set: (val) => {
    props.field.value = val;
  },
});
const processOptions = (options: SelectOption[] | Record<string, SelectOption>): SelectOption[] => {
  if (!Array.isArray(options)) {
    return Object.values(options).sort((a, b) => a.label.localeCompare(b.label));
  }
  return options.sort((a, b) => a.label.localeCompare(b.label));
};
if (props.field.type === 'select') {
  assertDefined(props.field.options, 'props.field.options')
  const formattedOptions = computed(() => processOptions(props.field.options));
}

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
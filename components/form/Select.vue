<template>
  <div>
    <FormLabel v-if="field.label" :label="field.label"/>
    <Field
        class="border rounded shadow px-3 py-1.5 text-skin-base bg-skin-base focus:outline-none focus:ring-2 focus:ring-skin-accent w-full"
        as="select"
        :id="field.name"
        :name="field.name"
        v-model="modelValue"
        :readonly="field.readonly"
        :disabled="field.disabled"
        :rules="field.rules"
        @input="onInput"
    >
      <option v-for="(option, index) in formattedOptions" :value="option.value" :key="index">{{ option.label }}</option>
    </Field>
  </div>

</template>
<script setup lang="ts">
import {Field} from "vee-validate";
import type {FieldData} from "~/interfaces/FieldData";
import {computed} from "vue";

export interface SelectOption {
  label: string,
  value: string | number
}

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
assertDefined(props.field.options, 'props.field.options')
const formattedOptions = computed(() => processOptions(props.field.options));

const emit = defineEmits(['update:modelValue']);

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>

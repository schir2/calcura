<template>
  <div class="flex flex-col gap-1">

    <FormLabel v-if="field.label" :label="field.label"/>
    <n-input :name="field.name"
             v-model:value="value"
             :placeholder="field.placeholder"
             v-bind="naiveInputProps"
    />
    <FormHelpText v-if="field.helpText" :helpText="field.helpText"></FormHelpText>
    <ErrorMessage :name="field.name" class="block text-skin-error text-sm mt-1"/>
  </div>
</template>
<script setup lang="ts">
import {ErrorMessage} from 'vee-validate';
import type {Field} from '~/interfaces/FieldData';

interface NaiveUiProps {
  autoSize?: boolean;
  clearable?: boolean;
  defaultValue?: string;
  loading?: boolean;
  maxlength?: number;
  minlength?: number;
  readonly?: boolean;
  showCount?:	boolean;
  round?: boolean;
  rows?: number;
  size?:	'tiny' | 'small' | 'medium' | 'large';
  status?:	'success' | 'warning' | 'error';
  type?:	'text' | 'password' | 'textarea'
}

interface Props<T = any> {
  field: Field<T>;
  modelValue?: T;
}

const props = defineProps<Props & NaiveUiProps>();
const {value, errorMessage} = useField(props.field.name, props.field.rules, {
  initialValue: props.modelValue
})

const emit = defineEmits(['update:modelValue'])
watch(value, (newValue) => {
  emit('update:modelValue', newValue)
})

const naiveInputProps = computed(() => {
  const { field, modelValue, ...rest } = props;
  return rest; // Forward remaining props to n-input
});
</script>
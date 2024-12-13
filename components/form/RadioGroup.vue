<template>
  <div>
    <FormLabel v-if="field.label" :label="field.label"/>
    <n-radio-group
        v-model:value="model[field.name]"
        :disabled="field.disabled"
        :id="field.name"
        @update:value="onInput"
    >
      <n-radio
          v-for="(option, index) in formattedOptions"
          :key="index"
          :value="option.value"
      >
        {{ option.label }}
      </n-radio>
    </n-radio-group>
  </div>
</template>

<script setup lang="ts">
import { NRadioGroup, NRadio } from "naive-ui";
import type { FieldData } from "~/interfaces/FieldData";
import { computed } from "vue";

export interface SelectOption {
  label: string;
  value: string | number;
}

interface Props<T = any> {
  field: FieldData<T>;
  model: Record<string, any>;
}

const props = defineProps<Props>();

const processOptions = (options: SelectOption[] | Record<string, SelectOption>): SelectOption[] => {
  if (!Array.isArray(options)) {
    return Object.values(options).sort((a, b) => a.label.localeCompare(b.label));
  }
  return options.sort((a, b) => a.label.localeCompare(b.label));
};
assertDefined(props.field.options, "props.field.options");
const formattedOptions = computed(() => processOptions(props.field.options));

const emit = defineEmits(["update:modelValue"]);

const onInput = (value: string | number) => {
  emit("update:modelValue", value);
};
</script>

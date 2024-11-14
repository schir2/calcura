<script setup lang="ts">
export interface SelectOption {
  label: string,
  value: string | number
}

interface Props {
  options: SelectOption[] | Record<string, SelectOption>
}

const processOptions = (options: SelectOption[] | Record<string, SelectOption>): SelectOption[] => {
  if (!Array.isArray(options)) {
    return Object.values(options).sort((a, b) => a.label.localeCompare(b.label));
  }
  return options.sort((a, b) => a.label.localeCompare(b.label));
};

const {options = []} = defineProps<Props>()
const formattedOptions = computed(() => processOptions(options));
</script>

<template>
  <select>
    <option v-for="(option, index) in formattedOptions" :value="option.value" :key="index">{{ option.label }}</option>
  </select>

</template>
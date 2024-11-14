<script setup lang="ts">
export interface SelectOption {
  label: string,
  value: string | number
}

interface Props {
  options: SelectOption[] | Record<string, SelectOption>
}

const convertOptionsToList = (opts: Record<string, SelectOption>) => {
  return Object.values(opts).sort((a, b) => {
    return a.label.localeCompare(b.label);
  });
}

const processOptions = (opts: SelectOption[] | Record<string, SelectOption>): SelectOption[] => {
  // Convert Record to array if necessary and sort alphabetically by label
  if (!Array.isArray(opts)) {
    return Object.values(opts).sort((a, b) => a.label.localeCompare(b.label));
  }
  // If already an array, just sort
  return opts.sort((a, b) => a.label.localeCompare(b.label));
};

const {options = []} = defineProps<Props>()
const formattedOptions = computed(() => processOptions(options));
</script>

<template>
  <select>
    <option v-for="(option, index) in formattedOptions" :value="option.value" :key="index">{{ option.label }}</option>
  </select>

</template>
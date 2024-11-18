<template>
  <div>
    <FormLabel v-if="field.label" :label="field.label"></FormLabel>
    <div>
      <label class="inline-flex items-center cursor-pointer">
        <Field
            :id="field.name"
            :name="field.name"
            type="checkbox"
            v-model="model[field.name]"
            :value="true"
            :unchecked-value="false"
            :disabled="field.disabled"
            :readonly="field.readonly"
            :rules="field.rules"
            class="sr-only peer"
        />
        <div
            class="relative w-11 h-6 bg-skin-primary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-skin-accent rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-skin-primary after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-skin-base after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-skin-accent"
        ></div>
        <span class="ms-3 text-sm font-medium text-skin-base">{{ field.helpText }}</span>
      </label>
    </div>
    <FormHelpText v-if="field.helpText" :helpText="field.helpText"/>
    <ErrorMessage :name="field.name" class="text-skin-error text-sm mt-1"/>
  </div>
</template>

<script setup lang="ts">
import {ErrorMessage, Field} from 'vee-validate';
import type {FieldData} from '~/interfaces/FieldData';

interface Props<T = any> {
  field: FieldData<T>;
  model: any;
}

const props = defineProps<Props>();
</script>

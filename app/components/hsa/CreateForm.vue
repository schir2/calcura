<script lang="ts" setup>
import type {Hsa, HsaInsert} from "#shared/types/Hsa"
import { hsaRules } from "~/utils/validators/hsaRules"
import {hsaDefaults} from "~/constants/HsaConstants"

type Props = { initialValues?: Partial<Hsa> }
const props = defineProps<Props>()

const emit = defineEmits<{
  create: [insert: HsaInsert]
  cancel: []
}>()

const model = ref<Partial<Hsa>>({...hsaDefaults, ...props.initialValues})
const {formRef, pending, rules, apiErrors, onSubmit} = useNaiveForm(model)
const errorMessage = ref('')
rules.value = hsaRules(model).rules

const STRATEGY_OPTIONS = [
  {value: 'fixed', label: 'Fixed', hint: 'A set amount each year'},
  {value: 'max', label: 'Max', hint: 'Contribute the IRS limit'},
]

function handleSubmit() {
  onSubmit(async () => {
    const {id: _id, ...insert} = model.value as Hsa
    emit('create', insert as HsaInsert)
  })
}
</script>
<template>
  <n-card role="dialog" class="max-w-4xl" :bordered="true">
    <template #header>
      <h3 class="text-2xl">HSA : {{ model.name }}</h3>
    </template>

    <template #default>
      <n-alert v-if="Object.keys(apiErrors).length > 0" type="error" :title="errorMessage || 'An error occurred'" class="mb-4"/>
      <n-form ref="formRef" :model="model" :rules="rules">
        <section class="grid grid-cols-3 gap-3">
          <n-form-item label="Name" path="name">
            <n-input v-model:value="model.name" placeholder="Enter HSA name"/>
          </n-form-item>

          <n-form-item label="Initial Balance" path="initial_balance">
            <n-input-number class="w-full" v-model:value="model.initial_balance" placeholder="Enter initial balance"/>
          </n-form-item>

          <n-form-item label="Growth Rate (%)" path="growth_rate">
            <base-number-slider v-model="model.growth_rate" :min="0" :max="15" :step="0.5"/>
          </n-form-item>
        </section>

        <div class="text-sm font-medium text-skin-base mb-2">Contribution</div>
        <common-strategy-rows v-model="model.contribution_strategy" :options="STRATEGY_OPTIONS">
          <template #fixed>
            <n-form-item label="Amount / yr" path="contribution_fixed_amount" :show-feedback="false">
              <base-number-slider v-model="model.contribution_fixed_amount" :min="0" :max="8300" :step="100"/>
            </n-form-item>
          </template>
        </common-strategy-rows>
      </n-form>
    </template>

    <template #action>
      <FormActionButtons variant="create" @create="handleSubmit" @cancel="emit('cancel')"/>
    </template>
  </n-card>
</template>

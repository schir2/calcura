<script lang="ts" setup>
import {type Hsa, hsaDefaults, HsaContributionStrategy} from "~/types/Hsa";
import {BrokerageContributionStrategy} from "~/types/Brokerage";
import {useHsaValidator} from "~/composables/validators/useHsaValidator";

interface Props {
  initialValues?: Partial<Hsa>;
  mode: 'create' | 'edit'
}

const {initialValues = hsaDefaults, mode} = defineProps<Props>();
const emit = defineEmits(["update", "cancel", "create"]);

const {formRef, modelRef, rules, handleCreate, handleUpdate, handleCancel} =
    useCrudFormWithValidation(initialValues, emit, useHsaValidator)

const HsaStrategyOptions = [
  {label: 'Fixed', value: 'fixed'},
  {label: 'Variable', value: 'variable'}
]

function parse(input: string) {
  const nums = input.replace(/,/g, '').trim()
  if (/^\d+(\.(\d+)?)?$/.test(nums))
    return Number(nums)
  return nums === '' ? null : Number.NaN
}

</script>
<template>
  <n-card role="dialog" class="max-w-4xl" :bordered="true">
    <template #header>
      <h3 class="text-2xl">Brokerage : {{ modelRef.name }}</h3>
    </template>

    <template #default>
      <n-form ref="formRef" :model="modelRef" :rules="rules">
        <section class="grid grid-cols-3 gap-3">
          <n-form-item label="Name" path="name">
            <n-input v-model:value="modelRef.name" placeholder="Enter investment name"/>
          </n-form-item>

          <n-form-item label="Initial Balance" path="initialBalance">
            <n-input-number class="w-full" v-model:value="modelRef.initialBalance" placeholder="Enter initial balance"/>
          </n-form-item>

          <n-form-item label="Growth Rate (%)" path="growthRate">
            <n-input-number class="w-full" v-model:value="modelRef.growthRate" placeholder="Enter growth rate"/>
          </n-form-item>
        </section>
        <n-form-item label="Contribution Strategy" path="contributionStrategy">
          <div class="grid grid-cols-3 gap-3 w-full">
            <CommonRadioCard v-model="modelRef.contributionStrategy" :value="BrokerageContributionStrategy.Fixed"
                             title="Fixed">
              <n-form-item label="Fixed Contribution Amount" path="contributionFixedAmount">
                <n-input-number class="w-full" v-model:value="modelRef.contributionFixedAmount"
                                placeholder="Enter fixed amount"/>
              </n-form-item>
            </CommonRadioCard>
          </div>
        </n-form-item>

      </n-form>
    </template>

    <template #action>
      <FormActionButtons :mode="mode" @update="handleUpdate" @create="handleCreate" @cancel="handleCancel"/>
    </template>
  </n-card>
</template>
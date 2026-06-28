<script lang="ts" setup>
import type { Plan, PlanInsert } from "#shared/types/Plan"
import { planDefaults } from "~/constants/planConstants"

type Props = { initialValues?: Partial<Plan> }
const props = defineProps<Props>()

const emit = defineEmits<{
  create: [insert: PlanInsert]
  cancel: []
}>()

const model = ref<Partial<Plan>>({ ...planDefaults, ...props.initialValues })
const { formRef, pending, rules, apiErrors, onSubmit } = useNaiveForm(model)
rules.value = usePlanValidator(model).rules

const currentStep = ref(1)

function handleClickPrevious() {
  if (currentStep.value > 1) currentStep.value -= 1
}

function handleClickNextStep() {
  if (currentStep.value < 3) currentStep.value += 1
}

function handleSubmit() {
  onSubmit(async () => {
    const { id: _id, ...insert } = model.value as Plan
    emit('create', insert as PlanInsert)
  })
}
</script>
<template>
  <n-card role="dialog" class="max-w-6xl" :bordered="true">
    <template #header>
      <h3 class="text-2xl">Create Plan: {{ model.name }}</h3>
    </template>
    <template #default>
      <div class="space-y-4">
        <n-alert v-if="Object.keys(apiErrors).length > 0" type="error" title="An error occurred" class="mb-4" />
        <PlanFormSteps v-model="currentStep" />
        <n-form ref="formRef" :model="model" :rules="rules">
          <PlanFormProfile v-if="currentStep === 1" v-model="model" />
          <PlanFormSettings v-else-if="currentStep === 2" v-model="model" />
          <PlanFormGoals v-else-if="currentStep === 3" v-model="model" />
        </n-form>
      </div>
    </template>
    <template #action>
      <n-button-group>
        <n-button @click="emit('cancel')">Cancel</n-button>
        <n-button :disabled="currentStep <= 1" secondary @click="handleClickPrevious">Previous</n-button>
        <n-button v-if="currentStep < 3" type="primary" secondary @click="handleClickNextStep">Next</n-button>
        <n-button v-else type="primary" :loading="pending" @click="handleSubmit">Create</n-button>
      </n-button-group>
    </template>
  </n-card>
</template>

<script lang="ts" setup>
import type { Plan, PlanUpdate } from "#shared/types/Plan"

type Props = { id: number }
const props = defineProps<Props>()

const emit = defineEmits<{
  update: [id: number, update: PlanUpdate]
  cancel: []
}>()

const store = usePlanStore()
const model = ref<Partial<Plan>>({})
const isFetching = ref(true)

const { formRef, pending, rules, apiErrors, onSubmit } = useNaiveForm(model)
rules.value = usePlanValidator(model).rules

const currentStep = ref(1)

onMounted(async () => {
  try {
    const data = await store.fetch(props.id)
    model.value = { ...data }
  } catch {
    emit('cancel')
  } finally {
    isFetching.value = false
  }
})

function handleClickPrevious() {
  if (currentStep.value > 1) currentStep.value -= 1
}

function handleClickNextStep() {
  if (currentStep.value < 3) currentStep.value += 1
}

function handleSubmit() {
  onSubmit(async () => {
    const { id: _id, ...update } = model.value as Plan
    emit('update', props.id, update as PlanUpdate)
  })
}
</script>
<template>
  <n-spin v-if="isFetching" />
  <n-card v-else role="dialog" class="max-w-6xl" :bordered="true">
    <template #header>
      <h3 class="text-2xl">Edit Plan: {{ model.name }}</h3>
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
        <n-button v-else type="primary" :loading="pending" @click="handleSubmit">Save</n-button>
      </n-button-group>
    </template>
  </n-card>
</template>
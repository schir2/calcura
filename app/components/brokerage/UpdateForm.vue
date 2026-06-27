<script lang="ts" setup>
import type { Brokerage, BrokerageUpdate } from "#shared/types/Brokerage"
import { useBrokerageValidator } from "~/composables/validators/useBrokerageValidator"

type Props = { id: number }
const props = defineProps<Props>()

const emit = defineEmits<{
  update: [id: number, update: BrokerageUpdate]
  cancel: []
}>()

const store = useBrokerageStore()
const model = ref<Partial<Brokerage>>({})
const isFetching = ref(true)
const errorMessage = ref('')

const { formRef, pending, rules, apiErrors, onSubmit } = useNaiveForm(model)
rules.value = useBrokerageValidator(model).rules

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

function handleSubmit() {
  onSubmit(async () => {
    const { id: _id, ...update } = model.value as Brokerage
    emit('update', props.id, update as BrokerageUpdate)
  })
}
</script>
<template>
  <n-spin v-if="isFetching" />
  <n-card v-else role="dialog" class="max-w-4xl" :bordered="true">
    <template #header>
      <h3 class="text-2xl">Brokerage : {{ model.name }}</h3>
    </template>

    <template #default>
      <n-alert v-if="Object.keys(apiErrors).length > 0" type="error" :title="errorMessage || 'An error occurred'" class="mb-4" />
      <n-form ref="formRef" :model="model" :rules="rules">
        <section class="grid grid-cols-3 gap-3">
          <n-form-item label="Name" path="name">
            <n-input v-model:value="model.name" placeholder="Enter investment name"/>
          </n-form-item>

          <n-form-item label="Initial Balance" path="initialBalance">
            <n-input-number class="w-full" v-model:value="model.initial_balance"
                            placeholder="Enter initial balance"/>
          </n-form-item>

          <n-form-item label="Growth Rate (%)" path="growthRate">
            <n-input-number class="w-full" v-model:value="model.growth_rate" placeholder="Enter growth rate"/>
          </n-form-item>
        </section>
        <n-form-item label="Contribution Strategy" path="contributionStrategy">
          <div class="grid grid-cols-3 gap-3 w-full">
            <CommonRadioCard v-model="model.contribution_strategy" :value="'fixed'"
                             title="Fixed">
              <n-form-item label="Fixed Contribution Amount" path="contributionFixedAmount">
                <n-input-number class="w-full" v-model:value="model.contribution_fixed_amount"
                                placeholder="Enter fixed amount"/>
              </n-form-item>
            </CommonRadioCard>
            <CommonRadioCard v-model="model.contribution_strategy"
                             :value="'percentage_of_income'" title="Percentage of Income">
              <n-form-item label="Contribution Percentage (%)" path="contributionPercentage">
                <n-input-number class="w-full" v-model:value="model.contribution_percentage"
                                placeholder="Enter percentage"/>
              </n-form-item>
            </CommonRadioCard>
            <CommonRadioCard v-model="model.contribution_strategy" :value="'max'"
                             title="Max Out"/>
          </div>
        </n-form-item>
      </n-form>
    </template>

    <template #action>
      <FormActionButtons variant="update" @update="handleSubmit" @cancel="emit('cancel')" />
    </template>
  </n-card>
</template>
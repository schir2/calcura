<script lang="ts" setup>
import type {Hsa, HsaUpdate} from "#shared/types/Hsa"
import { hsaRules } from "~/utils/validators/hsaRules"

type Props = { id: number }
const props = defineProps<Props>()

const emit = defineEmits<{
  update: [id: number, update: HsaUpdate]
  cancel: []
}>()

const store = useHsaStore()
const model = ref<Partial<Hsa>>({})
const isFetching = ref(true)
const errorMessage = ref('')

const {formRef, pending, rules, apiErrors, onSubmit} = useNaiveForm(model)
rules.value = hsaRules(model).rules

onMounted(async () => {
  try {
    const data = await store.fetch(props.id)
    model.value = {...data}
  } catch {
    emit('cancel')
  } finally {
    isFetching.value = false
  }
})

function handleSubmit() {
  onSubmit(async () => {
    const {id: _id, ...update} = model.value as Hsa
    emit('update', props.id, update as HsaUpdate)
  })
}
</script>
<template>
  <n-spin v-if="isFetching"/>
  <n-card v-else role="dialog" class="max-w-4xl" :bordered="true">
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
            <n-input-number class="w-full" v-model:value="model.growth_rate" placeholder="Enter growth rate"/>
          </n-form-item>
        </section>

        <n-form-item label="Contribution Strategy" path="contribution_strategy">
          <div class="grid grid-cols-2 gap-3 w-full">
            <CommonRadioCard v-model="model.contribution_strategy" :value="'fixed'" title="Fixed">
              <n-form-item label="Fixed Contribution Amount" path="contribution_fixed_amount">
                <n-input-number class="w-full" v-model:value="model.contribution_fixed_amount" placeholder="Enter fixed amount"/>
              </n-form-item>
            </CommonRadioCard>
            <CommonRadioCard v-model="model.contribution_strategy" :value="'max'" title="Max Out"/>
          </div>
        </n-form-item>
      </n-form>
    </template>

    <template #action>
      <FormActionButtons variant="update" @update="handleSubmit" @cancel="emit('cancel')"/>
    </template>
  </n-card>
</template>

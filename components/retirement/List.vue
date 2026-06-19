<template>
  <n-button @click="handleCreateRetirement()">Add</n-button>
  <div class="container">
    <Retirement v-for="(debtConfig, index) in debts" :debtConfig="debtConfig" :key="debtConfig.id"
          @delete="handleDeleteRetirement" @update="handleUpdateRetirement"></Retirement>
  </div>

</template>
<script lang="ts" setup>
type Props = {
  debts: RetirementConfig[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  delete: [id: number]
  update: [debtConfig: RetirementConfig]
  create: []
}>()

function handleDeleteRetirement(debtId: number) {
  emit('delete', debtId)
}
function handleCreateRetirement() {
  emit('create')
}
function handleUpdateRetirement(debtConfig: RetirementConfig) {
  emit('update', debtConfig)
}

</script>
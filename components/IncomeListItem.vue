<template>
  <n-list-item>
    <n-thing class="p-2">
      <ul class="grid grid-cols-5">
        <li>{{ income.name }}</li>
        <li>
          <n-tag type="info" size="small">{{ income.incomeType }}</n-tag>
        </li>
        <li>{{ income.grossIncome }}</li>
        <li class="text-end col-span-2">
          <n-button-group size="small">
            <n-button tertiary round type="warning" @click="handleEdit">
              <template #icon>
                <Icon name="mdi:edit"/>
              </template>
              Edit
            </n-button>
            <n-button tertiary round type="error" @click="handleRemove">
              <template #icon>
                <Icon name="mdi:remove"/>
              </template>
              Remove

            </n-button>
            <n-button secondary round type="error" @click="handleDelete">
              <template #icon>
                <Icon name="mdi:delete"/>
              </template>
              Delete
            </n-button>
          </n-button-group>
        </li>
      </ul>
    </n-thing>
  </n-list-item>

</template>
<script setup lang="ts">
import type {Income} from '~/models/income/Income';

interface Props {
  income: Income;
}

const props = defineProps<Props>()

function handleEdit() {
}

function handleDelete() {
  emit('delete', props.income);

}

function handleRemove() {
  emit('remove', props.income);
}

const emit = defineEmits(['delete', 'update', 'remove']);


</script>
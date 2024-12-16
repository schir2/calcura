<template>
  <n-modal v-model:show="showModal">
    <DebtForm :debtPartial="debt" mode="edit"
                 @delete="handleDelete"
                 @create="handleCreate"
                 @update="handleUpdate"
                 @cancel="handleClose"
    />
  </n-modal>
  <n-list-item>
    <n-thing class="p-2">
      <template #header>
        <span>{{ debt.name }}</span>
      </template>
      <template #default>
        <ul class="grid grid-cols-5">
        </ul>
      </template>
      <template #header-extra>
        <ListItemButtons @edit="handleEdit" @remove="handleRemove" @delete="handleDelete"/>
      </template>
    </n-thing>
  </n-list-item>

</template>
<script setup lang="ts">

import type {Debt} from "~/models/debt/Debt";

interface Props {
  debt: Debt
}

const props = defineProps<Props>()

const showModal = ref<boolean>(false)

const emit = defineEmits(['delete', 'update', 'create', 'remove']);

function handleDelete() {
  emit('delete', props.debt);
}

function handleUpdate(debt: Partial<Debt>) {
  emit('update', debt)
  showModal.value = false;
}


function handleCreate(debtPartial: Partial<Debt>) {
  emit('create', debtPartial)
  showModal.value = false;
}


function handleRemove() {
  emit('remove', props.debt);
}

function handleClose() {
  showModal.value = false;
}

function handleEdit() {
  showModal.value = true;
}
</script>
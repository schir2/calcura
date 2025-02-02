<template>
  <n-modal v-model:show="showModal">
    <DebtForm :initialValues="debt" mode="edit"
                 @delete="handleDelete"
                 @create="handleCreate"
                 @update="handleUpdate"
                 @cancel="handleClose"
    />
  </n-modal>
    <n-card size="small">
      <template #header>
        <span>{{ debt.name }}</span> <small class="text-xs">{{debt.id}}</small>
      </template>
      <ul class="grid grid-cols-2 items-end">
        <li>
          <span class="flex">
            <n-tag>
              <template #icon>
                <Icon name="mdi:trending-up"></Icon>
              </template>
              {{ debt.interestRate }}%</n-tag>
            <n-tag>{{ debt.paymentStrategy}}</n-tag>
          </span>
        </li>
        <li class="text-end">
          <span class="text-lg">${{$humanize.intComma(debt.principal)}}</span>
        </li>
      </ul>
      <template #header-extra>
        <ListItemButtons size="small" @edit="handleEdit" @remove="handleRemove" @delete="handleDelete"/>
      </template>
    </n-card>

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
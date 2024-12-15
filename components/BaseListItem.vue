<template>
  <n-modal v-model:show="showModal">
    <slot name="form"
          :item="item"
          :close="handleClose"
          :emitUpdate="handleUpdate"
          :emitDelete="handleDelete"
          :emitCreate="handleCreate">
    </slot>
  </n-modal>
  <n-list-item>
    <n-thing class="p-2">
      <template #header>
        <slot name="header" :item="item"></slot>
      </template>
      <template #default>
        <slot :item="item"></slot>
      </template>
      <template #header-extra>
        <slot name="header-extra"
              :edit="handleEdit"
              :remove="handleRemove"
              :delete="handleDelete"
              :item="item">
        </slot>
      </template>
    </n-thing>
  </n-list-item>
</template>

<script setup lang="ts">
const props = defineProps({
  item: { type: Object, required: true }
})
const emit = defineEmits(['delete', 'update', 'create', 'remove'])

const showModal = ref(false)

function handleDelete() { emit('delete', props.item) }
function handleUpdate(update) { emit('update', update); showModal.value = false }
function handleCreate(createPartial) { emit('create', createPartial); showModal.value = false }
function handleRemove() { emit('remove', props.item) }
function handleClose() { showModal.value = false }
function handleEdit() { showModal.value = true }
</script>

<template>
  <n-button-group :size="'tiny'">
    <n-popconfirm v-model:show="showDeletePopConfirm">
      <template #icon>
        <Icon class="text-6xl text-skin-error" name="mdi:delete"/>
      </template>
      <template #action>
        <n-button tertiary round @click="showDeletePopConfirm=false">Cancel</n-button>
        <n-button tertiary type="error" round @click=handleDelete()>
          <template #icon>
            <Icon name="mdi:delete"/>
          </template>
          Delete
        </n-button>
      </template>
      <template #trigger>
        <n-button secondary round type="error">
          <template #icon>
            <Icon name="mdi:delete"/>
          </template>
        </n-button>
      </template>
      <div class="max-w-[calc(100vw-2rem)] sm:max-w-md px-3 pe-3">
        <h2 class="text-heading my-3 text-skin-error">Delete Item</h2>
        <p>Are you sure you want to delete this item?</p>
        <p class="text-skin-info text-xs mb-2">This will permanently remove this from this plan and all other plans as well as your account.</p>
      </div>

    </n-popconfirm>
  </n-button-group>
</template>
<script setup lang="ts">
type Props = {
  size: "tiny" | "small" | "medium" | "large"
}

const props = defineProps<Props>()
const showDeletePopConfirm = ref(false)

const emit = defineEmits<{
  delete: []
}>()

function handleDelete() {
  showDeletePopConfirm.value = false
  emit('delete')
}
</script>
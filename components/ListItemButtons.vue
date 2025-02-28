<template>
  <n-button-group :size="'tiny'">
    <n-button tertiary round type="warning" @click="$emit('edit')">
      <template #icon>
        <Icon name="mdi:edit"/>
      </template>
    </n-button>
    <n-popconfirm v-model:show="showRemovePopConfirm">
      <template #icon>
        <Icon class="text-6xl text-skin-error" name="mdi:remove"/>
      </template>
      <template #action>
        <n-button tertiary round @click="showRemovePopConfirm=false">Cancel</n-button>
        <n-button tertiary type="error" round @click=handleRemove()>Remove</n-button>
      </template>
      <template #trigger>
        <n-button tertiary round type="error">
          <template #icon>
            <Icon name="mdi:remove"/>
          </template>
        </n-button>
      </template>
      <div class="max-w-md px-3 pe-3">
        <h2 class="text-xl my-3 text-skin-error font-semibold">Remove from Plan</h2>
        <p>Are you sure you want to remove this item from the plan?</p>
        <p class="text-skin-info text-xs mb-2">This will only remove this from the plan, it will sill exist on your account.</p>
      </div>
    </n-popconfirm>
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
      <div class="max-w-md px-3 pe-3">
        <h2 class="text-xl my-3 text-skin-error font-semibold">Delete Item</h2>
        <p>Are you sure you want to delete this item?</p>
        <p class="text-skin-info text-xs mb-2">This will permanently remove this from this plan and all other plans as well as your account.</p>
      </div>

    </n-popconfirm>
  </n-button-group>
</template>
<script setup lang="ts">
interface Props {
  size: "tiny" | "small" | "medium" | "large"
}

const props = defineProps<Props>()
const showRemovePopConfirm = ref(false)
const showDeletePopConfirm = ref(false)

const emit = defineEmits(['remove', 'delete', 'edit'])

function handleRemove() {
  showRemovePopConfirm.value = false
  emit('remove')
}

function handleDelete() {
  showDeletePopConfirm.value = false
  emit('delete')
}
</script>
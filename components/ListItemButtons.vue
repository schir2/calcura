<template>
  <n-button-group size="small">
    <n-button tertiary round type="warning" @click="$emit('edit')">
      <template #icon>
        <Icon name="mdi:edit"/>
      </template>
      Edit
    </n-button>
    <n-button tertiary round type="error" @click="$emit('remove')">
      <template #icon>
        <Icon name="mdi:remove"/>
      </template>
      Remove

    </n-button>
    <n-button secondary round type="error" @click="$emit('delete')">
      <template #icon>
        <Icon name="mdi:delete"/>
      </template>
      Delete
    </n-button>
  </n-button-group>
</template>
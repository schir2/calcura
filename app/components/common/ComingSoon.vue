<script setup lang="ts">
type Props = {
  title?: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Coming soon',
  description: 'This feature is on the way — check back shortly.',
})
</script>

<template>
  <div class="flex items-center justify-center py-16">
    <n-empty size="large" :description="description">
      <template #icon>
        <Icon name="mdi:hammer-wrench" />
      </template>
      <template #extra>
        <span class="text-skin-muted text-lg">{{ title }}</span>
      </template>
    </n-empty>
  </div>
</template>
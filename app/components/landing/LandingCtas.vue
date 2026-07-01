<!-- Shared landing CTA cluster: Play around (disabled), Create account, Log in. -->
<template>
  <div class="flex flex-wrap gap-3" :class="center ? 'justify-center' : ''">
    <n-tooltip trigger="hover">
      <template #trigger>
        <span class="inline-block">
          <n-button type="primary" size="large" strong disabled>▶ Play around</n-button>
        </span>
      </template>
      Coming soon: build a plan without an account
    </n-tooltip>
    <n-button type="primary" size="large" strong ghost @click="$router.push('/auth/register')">
      Create free account
    </n-button>
    <n-button type="default" size="large" @click="$router.push('/auth/login')">
      Log in
    </n-button>
  </div>
</template>

<script lang="ts" setup>
defineProps<{ center?: boolean }>()
</script>

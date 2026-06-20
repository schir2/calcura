<script lang="ts" setup>

const route = useRoute()

useHead(() => ({
  title: route.meta.title as string ?? null,
}))

</script>

<template>

  <div class="flex flex-col gap-16">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
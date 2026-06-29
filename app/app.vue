<script lang="ts" setup>

const route = useRoute()

const { colorMode } = useNaiveColorMode()

useHead(() => ({
  title: route.meta.title as string ?? null,
  htmlAttrs: {
    class: colorMode.value === 'dark' ? 'dark' : '',
  },
}))

const supabase = useSupabaseClient()

</script>

<template>

  <div class="flex flex-col gap-16">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script lang="ts" setup>
import { buildThemeCss } from '~/theme/palette'

const route = useRoute()

const { colorMode } = useNaiveColorMode()

// Inject the design-token CSS vars (single source: app/theme/palette.ts) SSR-side so
// Tailwind skin tokens resolve on first paint with no flash. Constant per build.
const themeCss = buildThemeCss()

useHead(() => ({
  title: route.meta.title as string ?? null,
  htmlAttrs: {
    class: colorMode.value === 'dark' ? 'dark' : '',
  },
  style: [{ id: 'design-tokens', innerHTML: themeCss }],
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
<script setup>
definePageMeta({
  layout: "error"
})

useHead({
  title: "404 - Page Not Found",
});
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen text-center">
    <h1 class="text-4xl font-bold">404</h1>
    <p class="text-lg">Oops! The page you're looking for doesn't exist.</p>
    <NuxtLink to="/" class="mt-4 text-blue-600 hover:underline">
      Go back home
    </NuxtLink>
  </div>
</template>

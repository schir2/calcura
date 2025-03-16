<script lang="ts" setup>
const route = useRoute()
const slug = route.params.slug
const article = useFetch<Article>(`api/articles/${slug}`)
const title = ref<string>('')
useHead({
  title: title.value,
})
</script>
<template>
  <article>
    {{ article }}
  </article>
</template>
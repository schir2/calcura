<template>
  <NaiveConfig>
    <n-loading-bar-provider>
      <n-message-provider>
        <LayoutTheNavbar/>

        <div class="container mx-auto my-2">
          <slot/>
        </div>
      </n-message-provider>
    </n-loading-bar-provider>
  </NaiveConfig>
</template>
<script setup lang="ts">
import {useTitle} from "~/composables/useTitle";

const {title} = useTitle()

useHead({
  title: title
})
</script>

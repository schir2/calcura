<template>
  <n-loading-bar-provider>
    <n-config-provider :theme="darkTheme">
      <n-message-provider>
        <LayoutTheNavbar/>
        <aurora-background>
          <div class="container mx-auto my-2">
              <slot/>
          </div>
        </aurora-background>
      </n-message-provider>
    </n-config-provider>
  </n-loading-bar-provider>
</template>
<script setup lang="ts">
import {darkTheme, NConfigProvider, NMessageProvider} from 'naive-ui'
import AuroraBackground from "~/components/effects/AuroraBackground.vue";
import {useTitle} from "~/composables/useTitle";
const {title} = useTitle()

useHead({
  title: title
})
</script>
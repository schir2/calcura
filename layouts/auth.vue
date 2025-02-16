<template>
  <n-loading-bar-provider>
    <n-config-provider :theme="darkTheme">
      <n-message-provider>
        <div class="h-screen bg-skin-base">
          <LayoutTheNavbar/>
          <div class="w-96 mx-auto my-auto">
            <slot/>
          </div>
        </div>
      </n-message-provider>
    </n-config-provider>
  </n-loading-bar-provider>
</template>
<script setup lang="ts">
import {darkTheme, NConfigProvider, NMessageProvider} from 'naive-ui'

const route = useRoute()
useHead({
  title: route.meta.title || 'Calcura'
})
</script>
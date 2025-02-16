<template>
  <n-loading-bar-provider>
    <n-config-provider :theme="darkTheme">
      <n-message-provider>
        <div class="min-h-screen bg-skin-base">
          <LayoutTheNavbar/>
          <div class="min-h-nav-offset flex items-center justify-center">
            <n-card class="w-96 mx-auto">
              <h1 class="text-4xl mb-4">{{ title }}</h1>
              <slot/>
            </n-card>
          </div>
        </div>
      </n-message-provider>
    </n-config-provider>
  </n-loading-bar-provider>
</template>
<script setup lang="ts">
import {darkTheme, NConfigProvider, NMessageProvider} from 'naive-ui'

const route = useRoute()

function getTitle(): string {
  return route.meta.title as string || 'Calcura';
}

const title = getTitle()
useHead({
  title: title
})
</script>
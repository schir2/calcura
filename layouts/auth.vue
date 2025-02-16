<template>
  <n-loading-bar-provider>
    <n-config-provider :theme="darkTheme">
      <n-message-provider>
          <LayoutTheNavbar/>
        <aurora-background>
          <div class="min-h-nav-offset flex items-center justify-center">
            <n-card class="w-96 mx-auto">
              <h1 class="text-4xl mb-4">{{ title }}</h1>
              <slot/>
            </n-card>
          </div>
        </aurora-background>
      </n-message-provider>
    </n-config-provider>
  </n-loading-bar-provider>
</template>
<script setup lang="ts">
import {darkTheme, NConfigProvider, NMessageProvider} from 'naive-ui'
import AuroraBackground from "~/components/effects/AuroraBackground.vue";

const route = useRoute()

function getTitle(): string {
  return route.meta.title as string || 'Calcura';
}

const title = getTitle()
useHead({
  title: title
})
</script>
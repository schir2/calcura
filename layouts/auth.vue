<template>
  <n-loading-bar-provider>
    <n-config-provider :theme="darkTheme">
      <n-message-provider>
        <LayoutTheNavbar/>
        <aurora-background>
          <div class="min-h-nav-offset flex items-center justify-center">
            <n-card class="w-96 mx-auto">
              <template #header>
                <div class="flex justify-between">
                  <h1 class="text-4xl flex items-center gap-4">
                    <a href="#" @click.prevent="$router.push('/')" aria-label="Back to Home">
                      <img src="/assets/img/logos/calcura-logo.svg" alt="Calcura" class="h-12 inline-block">
                    </a>
                    <span>{{ title }}</span>
                  </h1>
                  <n-button quaternary type="primary" @click="$router.push('/')">Home</n-button>
                </div>
              </template>
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
import {useTitle} from "~/composables/useTitle";

const {title} = useTitle()

useHead({
  title: title
})
</script>
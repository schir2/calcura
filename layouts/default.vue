<template>
  <n-scrollbar class="h-screen">
    <n-loading-bar-provider>
      <n-config-provider :theme="darkTheme">
        <n-message-provider>
          <n-space vertical :naive-scrollbar="false">
            <LayoutTheNavbar/>
            <n-layout has-sider class="min-h-nav-offset" :naive-scrollbar="false">
              <LayoutTheLeftSidebar/>
              <n-layout class="mr-2" :native-scrollbar="false">
                <effects-aurora-background class="p-4">
                  <h1 class="text-4xl mb-4">{{ title }}</h1>
                  <slot/>
                </effects-aurora-background>
              </n-layout>
            </n-layout>
          </n-space>
        </n-message-provider>
      </n-config-provider>
    </n-loading-bar-provider>
  </n-scrollbar>
</template>
<script setup lang="ts">
import {darkTheme, NConfigProvider, NMessageProvider} from 'naive-ui'
import {useTitle} from "~/composables/useTitle";

const {title} = useTitle()
useHead({
  title: title
})
</script>
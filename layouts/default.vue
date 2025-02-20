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
<style>
.page-left-enter-active,
.page-right-enter-active,
.page-left-leave-active,
.page-right-leave-active {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  transition: all 500ms linear;
}

.page-left-enter-from, .page-right-leave-to {
  transform: translateX(100%);
}

.page-left-leave-to, .page-right-enter-from {
  transform: translateX(-100%);
}

.page-left-enter-to, .page-right-enter-to {
  transform: translateX(0);
}
</style>
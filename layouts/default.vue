<template>
  <n-scrollbar class="h-screen">
  <n-loading-bar-provider>
    <n-config-provider :theme="darkTheme">
      <n-message-provider>
        <n-space vertical :naive-scrollbar="false">
          <LayoutTheNavbar/>
          <n-layout has-sider class="h-screen" :naive-scrollbar="false">
            <LayoutTheLeftSidebar/>
            <n-layout :native-scrollbar="false">
              <slot/>
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
</script>
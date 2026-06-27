<template>
  <main>
    <NaiveConfig>
      <n-loading-bar-provider>
        <n-message-provider>
          <n-scrollbar class="h-screen">
            <n-space vertical>
              <LayoutTheNavbar/>
              <n-layout has-sider class="min-h-nav-offset" :naive-scrollbar="false">
                <LayoutTheLeftSidebar/>
                <n-layout class="mr-2" :native-scrollbar="false">
                  <slot/>
                </n-layout>
              </n-layout>
            </n-space>
          </n-scrollbar>
        </n-message-provider>
      </n-loading-bar-provider>
    </NaiveConfig>
  </main>
</template>
<script setup lang="ts">
import {useTitle} from "~/composables/useTitle";

const {title} = useTitle()
useHead({
  title: title
})
</script>
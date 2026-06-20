<template>
  <main>
    <n-scrollbar class="h-screen">
      <n-loading-bar-provider>
        <n-config-provider :theme="darkTheme">
          <n-message-provider>
            <n-space vertical>
              <LayoutTheNavbar/>
              <n-layout has-sider :naive-scrollbar="false">
                <n-layout :native-scrollbar="false">

                  <div class="container mx-auto my-2">
                    <slot/>
                  </div>

                </n-layout>
              </n-layout>
            </n-space>
          </n-message-provider>
        </n-config-provider>
      </n-loading-bar-provider>
    </n-scrollbar>
  </main>
</template>
<script setup lang="ts">
import {darkTheme, NConfigProvider, NMessageProvider} from 'naive-ui'
import {useTitle} from "~/composables/useTitle";

const {title} = useTitle()
useHead({
  title: title
})
</script>
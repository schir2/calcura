<template>
  <main>
    <n-scrollbar class="h-screen">
      <n-loading-bar-provider>
        <n-config-provider :theme="naiveTheme">
          <n-message-provider>
            <n-space vertical>
              <LayoutTheNavbar/>
              <n-layout has-sider class="min-h-nav-offset" :naive-scrollbar="false">
                <LayoutTheLeftSidebar/>
                <n-layout class="mr-2" :native-scrollbar="false">
                  <slot/>
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
import {NConfigProvider, NMessageProvider} from 'naive-ui'
import {useTitle} from "~/composables/useTitle";

const {title} = useTitle()


useHead({
  title: title
})

const themeStore = useThemeStore()
const {theme, naiveTheme} = storeToRefs(themeStore)

</script>
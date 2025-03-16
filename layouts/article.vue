<script lang="ts" setup>
import {NConfigProvider, NMessageProvider} from 'naive-ui'
import {useTitle} from "~/composables/useTitle";

const {title} = useTitle()


useHead({
  title: title
})

const themeStore = useThemeStore()
const {theme, naiveTheme} = storeToRefs(themeStore)
</script>

<template>
  <nuxt-loading-indicator/>
  <n-config-provider :theme="naiveTheme">
    <n-message-provider>
      <div class="layout grid h-screen">
        <layout-the-navbar style="grid-area:topnav"/>
        <layout-the-left-sidebar style="grid-area:left-side-menu"/>
        <n-scrollbar style="grid-area:content">
          <main class="p-8 content mx-auto prose prose-skin max-w-2xl">
            <slot name="default"/>
          </main>
        </n-scrollbar>
        <aside style="grid-area:right-side-menu">
          <slot name="right"></slot>
        </aside>
      </div>
    </n-message-provider>
  </n-config-provider>
</template>
<style scoped>
.layout {
  overflow: hidden;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
      'topnav topnav topnav'
      'left-side-menu content right-side-menu';
}
</style>
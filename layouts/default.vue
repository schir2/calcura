<template>
  <n-config-provider :theme="naiveUiTheme">
    <div>
      <!-- Navbar -->
          <LayoutTheNavbar/>

      <div class="grid grid-cols-12 gap-6">

        <LayoutTheLeftSidebar class="col-span-2"/>


        <main class="flex-grow mx-auto container p-16 bg-skin-base shadow-md rounded-md space-y-12 col-span-7">
          <slot/>
        </main>

        <LayoutTheRightSidebar class="col-span-3"/>
      </div>
    </div>
  </n-config-provider>
</template>
<script setup lang="ts">
const themeStore = useThemeStore()
import { darkTheme, lightTheme, NConfigProvider } from 'naive-ui'
function getNaiveUiTheme(){
  return themeStore.theme === 'dark' ? darkTheme : lightTheme
}
const naiveUiTheme = ref(getNaiveUiTheme())
</script>
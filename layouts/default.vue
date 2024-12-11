<template>
  <n-config-provider :theme="naiveUiTheme">
    <div>
      <!-- Navbar -->
          <LayoutTheNavbar/>

      <div class="grid grid-cols-6 gap-6">
        <!-- Left Sidebar -->
        <LayoutTheLeftSidebar class="col-span-1"/>

        <!-- Main Content -->
        <main class="flex-grow mx-auto container p-16 bg-skin-surface shadow-md rounded-md space-y-12 col-span-4">
          <slot/>
        </main>

        <!-- Left Sidebar -->
        <LayoutTheRightSidebar class="col-span-1"/>
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
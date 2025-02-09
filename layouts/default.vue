<template>
  <n-config-provider :theme="darkTheme">
    <n-message-provider>
    <div>
      <!-- Navbar -->
      <LayoutTheNavbar/>

      <div class="grid grid-cols-12 gap-6">

        <LayoutTheLeftSidebar class="col-span-1"/>


        <main class="flex-grow mx-auto container p-16 bg-skin-base shadow-md rounded-md space-y-12 col-span-8">
          <slot/>
        </main>

        <LayoutTheRightSidebar class="col-span-3"/>
      </div>
    </div>
    </n-message-provider>
  </n-config-provider>
</template>
<script setup lang="ts">
import {darkTheme, NConfigProvider, NMessageProvider} from 'naive-ui'

</script>
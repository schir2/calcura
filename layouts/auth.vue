<template>
    <n-loading-bar-provider>
      <n-config-provider :theme="darkTheme">
        <n-message-provider>
            <div class="h-screen bg-skin-base">
            <LayoutTheNavbar/>
                <slot/>
            </div>
        </n-message-provider>
      </n-config-provider>
    </n-loading-bar-provider>
</template>
<script setup lang="ts">
import {darkTheme, NConfigProvider, NMessageProvider} from 'naive-ui'
</script>
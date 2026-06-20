<template>
  <n-layout-sider
      bordered
      :collapsed-width="64"
      :width="340"
      :collapsed="collapsed"
      show-trigger
      absolute
      @collapse="collapsed = true"
      @expand="collapsed = false"
      :native-scrollbar="false"
  >
    <n-scrollbar class="min-h-nav-offset">
      <slot></slot>
    </n-scrollbar>
  </n-layout-sider>
</template>
<script lang="ts" setup>

const collapsed = ref<boolean>(false)
</script>
<script setup lang="ts">
const props = withDefaults(defineProps<{defaultCollapsed?: boolean}>(), {
  defaultCollapsed: false,
})

const {isAuthenticated} = useAuth()
const {menuOptions} = useNavMenu()

const collapsed = ref<boolean>(props.defaultCollapsed)
watch(() => props.defaultCollapsed, value => {
  collapsed.value = value
})
</script>

<template>
  <div class="mr-2">
    <n-layout-sider
        class="min-h-nav-offset"
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :collapsed="collapsed"
        show-trigger
        @collapse="collapsed = true"
        @expand="collapsed = false"
        :native-scrollbar="false"
    >
      <n-menu v-if="isAuthenticated"
              :collapsed="collapsed"
              :collapsed-width="64"
              :collapsed-icon-size="22"
              :options="menuOptions"
      />
    </n-layout-sider>
  </div>
</template>

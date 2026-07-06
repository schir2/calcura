<template>
  <main>
    <NaiveConfig>
      <n-loading-bar-provider>
        <n-message-provider>
          <n-scrollbar class="h-screen">
            <n-space vertical>
              <LayoutTheNavbar/>
              <n-layout :has-sider="!isMobile" class="min-h-nav-offset" :naive-scrollbar="false">
                <LayoutTheLeftSidebar v-if="!isMobile" :default-collapsed="isTablet"/>
                <n-layout class="mr-2" :native-scrollbar="false">
                  <slot/>
                </n-layout>
              </n-layout>
              <n-drawer v-if="isMobile" v-model:show="isOpen" :width="240" placement="left">
                <n-drawer-content title="Menu" body-content-style="padding: 0">
                  <n-menu :options="menuOptions" @update:value="handleNavSelect"/>
                </n-drawer-content>
              </n-drawer>
            </n-space>
          </n-scrollbar>
        </n-message-provider>
      </n-loading-bar-provider>
    </NaiveConfig>
  </main>
</template>
<script setup lang="ts">
import {onKeyStroke} from '@vueuse/core'
import {useTitle} from "~/composables/useTitle";

const {title} = useTitle()
useHead({
  title: title
})

const router = useRouter()
const {isMobile, isTablet} = useNavMode()
const {isOpen, close} = useNavDrawer()
const {menuOptions, routeByKey} = useNavMenu()

function handleNavSelect(key: string) {
  const to = routeByKey[key]
  if (to) router.push(to)
  close()
}

watch(isMobile, mobile => {
  if (!mobile) close()
})

onKeyStroke('Escape', () => {
  if (isOpen.value) close()
})
</script>
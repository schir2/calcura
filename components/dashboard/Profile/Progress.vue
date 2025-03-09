<script lang="ts" setup>
import type {UserProfile} from "~/types/UserProfile";

interface Props {
  profile: UserProfile
}

const props = defineProps<Props>()

const progressValue = computed((): number => {
  const values = Object.values(props.profile)
  const numValues = values.length
  const completedValues = values.reduce((acc, value) => acc + (value ? 1 : 0), 0)
  return completedValues / numValues * 100
})

const showModal = ref<boolean>(false)




</script>
<template>
  <div class="flex flex-col items-center gap-3">
    <n-progress size="small" type="circle" :percentage="progressValue"/>
    <span class="text-sm text-skin-muted">
      It seems like your are missing some details in your profile
    </span>
    <n-button @click="showModal=true" type="primary">Complete Your Profile</n-button>
  </div>
  <n-modal v-model:show="showModal">
    <profile-form :initial-values="profile" mode="edit"/>
  </n-modal>
</template>
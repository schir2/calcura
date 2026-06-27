<template>
  <n-thing>
    <n-modal v-model:show="showModal">
      <RothIraCreateForm :initial-values="activeRothIraPartial"
                         @create="handleCreate"
                         @cancel="handleClose"
      />
    </n-modal>
      <n-button size="small" type="info" round v-if="templates" v-for="(rothIraTemplate, index) in templates" :rothIraTemplate="rothIraTemplate"
                @click="handleOpenModal(rothIraTemplate)"
                :key="rothIraTemplate.name">
        <template #icon>
          <Icon name="mdi:add-circle"></Icon>
        </template>
        {{ rothIraTemplate.name }}
      </n-button>
  </n-thing>
</template>
<script lang="ts" setup>
import type {RothIra, RothIraInsert, RothIraTemplate} from "#shared/types/RothIra";
import {rothIraDefaults} from "~/constants/RothIraConstants";
import {processTemplate} from "~/utils/templateProcessorUtils";

const showModal = ref(false);
const activeRothIraPartial = ref<Partial<RothIra> | null>()
const rothIraTemplateStore = useRothIraTemplateStore()
const templates = computed(() => [rothIraDefaults, ...rothIraTemplateStore.list.map(t => processTemplate<Partial<RothIra>, RothIraTemplate, RothIra>(rothIraDefaults, t))])

function handleOpenModal(rothIraTemplate: Partial<RothIra>) {
  activeRothIraPartial.value = rothIraTemplate
  showModal.value = true;
}

onMounted(() => {
  rothIraTemplateStore.fetchAll()
})

const emit = defineEmits<{
  create: [insert: RothIraInsert]
}>()

function handleCreate(insert: RothIraInsert) {
  emit('create', insert)
  showModal.value = false
}

function handleClose() {
  showModal.value = false
}

</script>

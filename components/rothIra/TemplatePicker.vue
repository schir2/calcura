<template>
  <n-thing>
    <n-modal v-model:show="showModal">
      <RothIraForm :initialValues="activeRothIraPartial" mode="create"
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
import type {RothIraTemplate} from "~/types/RothIra";
import {type RothIra, rothIraDefaults, type RothIraPartial} from "~/types/RothIra";
import {useRothIraTemplateService} from "~/composables/api/useRothIraTemplateService";
import {processTemplate} from "~/utils/templateProcessorUtils";

const showModal = ref(false);
const activeRothIraPartial = ref<RothIraPartial | null>()
const templateService = useRothIraTemplateService()
const templates = ref<RothIraPartial[]>([])

async function loadTemplates() {
  templates.value =[rothIraDefaults]
  const loadedTemplates = await templateService.list()
  if (loadedTemplates.length > 0) {
    loadedTemplates.forEach(rothIraTemplate => templates.value.push(processTemplate<RothIraPartial, RothIraTemplate, RothIra>(rothIraDefaults, rothIraTemplate)));
  }
}

function handleOpenModal(rothIraTemplate: Partial<RothIra>) {
  activeRothIraPartial.value = rothIraTemplate
  showModal.value = true;
}

onMounted(async () => {
  await loadTemplates()
})

const emit = defineEmits(['create'])

function handleCreate(rothIraPartial: Partial<RothIra>) {
  emit('create', rothIraPartial)
  showModal.value = false;
}

function handleClose() {
  showModal.value = false
}

</script>
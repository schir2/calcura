<template>
  <n-thing>
    <n-modal v-model:show="showModal">
      <HsaForm :initialValues="activeHsaPartial" mode="create"
                       @create="handleCreate"
                       @cancel="handleClose"
      />
    </n-modal>
    <n-button size="small" type="info" round v-if="templates" v-for="(hsaTemplate, index) in templates"
              :hsaTemplate="hsaTemplate"
              @click="handleOpenModal(hsaTemplate)"
              :key="hsaTemplate.name">
      <template #icon>
        <Icon name="mdi:add-circle"></Icon>
      </template>
      {{ hsaTemplate.name }}
    </n-button>
  </n-thing>
</template>
<script lang="ts" setup>
import {
  type Hsa,
  hsaDefaults,
  type HsaPartial,
  type HsaTemplate
} from "~/types/Hsa";
import {useHsaTemplateService} from "~/composables/api/useHsaTemplateService";
import {processTemplate} from "~/utils/templateProcessorUtils";

const showModal = ref(false);
const activeHsaPartial = ref<HsaPartial | null>()
const templateService = useHsaTemplateService()
const templates = ref<HsaPartial[]>([])

async function loadTemplates() {
  templates.value = [hsaDefaults]
  const loadedTemplates = await templateService.list()
  if (loadedTemplates.length > 0) {
    loadedTemplates.forEach(hsaTemplate => templates.value.push(processTemplate<HsaPartial, HsaTemplate, Hsa>(hsaDefaults, hsaTemplate)));
  }
}

function handleOpenModal(hsaTemplate: Partial<Hsa>) {
  activeHsaPartial.value = hsaTemplate
  showModal.value = true;
}

onMounted(async () => {
  await loadTemplates()
})

const emit = defineEmits(['create'])

function handleCreate(hsaPartial: Partial<Hsa>) {
  emit('create', hsaPartial)
  showModal.value = false;
}

function handleClose() {
  showModal.value = false
}

</script>
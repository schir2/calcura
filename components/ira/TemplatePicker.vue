<template>
  <n-thing>
    <lazy-n-modal v-model:show="showModal">
      <IraForm :initialValues="activeIraPartial" mode="create"
                               @create="handleCreate"
                               @cancel="handleClose"
      />
    </lazy-n-modal>
      <n-button size="small" type="info" round v-if="templates" v-for="(iraTemplate, index) in templates" :iraTemplate="iraTemplate"
                @click="handleOpenModal(iraTemplate)"
                :key="iraTemplate.name">
        <template #icon>
          <Icon name="mdi:add-circle"></Icon>
        </template>
        {{ iraTemplate.name }}
      </n-button>
  </n-thing>
</template>
<script lang="ts" setup>
import type {IraTemplate} from "~/types/Ira";
import {type Ira, iraDefaults, type IraPartial} from "~/types/Ira";
import {useIraTemplateService} from "~/composables/api/useIraTemplateService";
import {processTemplate} from "~/utils/templateProcessorUtils";

const showModal = ref(false);
const activeIraPartial = ref<IraPartial | null>()
const templateService = useIraTemplateService()
const templates = ref<IraPartial[]>([])

async function loadTemplates() {
  const loadedIraTemplates = await templateService.list()
  templates.value = loadedIraTemplates.map(iraTemplate => processTemplate<IraPartial, IraTemplate, Ira>(iraDefaults, iraTemplate));
  templates.value.push(iraDefaults)
}

function handleOpenModal(iraTemplate: Partial<Ira>) {
  activeIraPartial.value = iraTemplate
  showModal.value = true;
}

onMounted(async () => {
  await loadTemplates()
})

const emit = defineEmits(['create'])

function handleCreate(iraPartial: Partial<Ira>) {
  emit('create', iraPartial)
  showModal.value = false;
}

function handleClose() {
  showModal.value = false
}

</script>
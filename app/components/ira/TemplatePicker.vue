<template>
  <n-thing>
    <n-modal v-model:show="showModal">
      <IraCreateForm :initial-values="activeIraPartial"
                    @create="handleCreate"
                    @cancel="handleClose"
      />
    </n-modal>
    <n-button size="small" type="info" round v-if="templates" v-for="(iraTemplate, index) in templates"
              :iraTemplate="iraTemplate"
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
import type {Ira, IraInsert, IraTemplate} from "#shared/types/Ira";
import {processTemplate} from "~/utils/templateProcessorUtils";
import {iraDefaults} from "~/constants/IraConstants";

const showModal = ref(false);
const activeIraPartial = ref<Partial<Ira> | null>()
const iraTemplateStore = useIraTemplateStore()
const templates = computed(() => [...iraTemplateStore.list.map(t => processTemplate<Partial<Ira>, IraTemplate, Ira>(iraDefaults, t)), iraDefaults])

function handleOpenModal(iraTemplate: Partial<Ira>) {
  activeIraPartial.value = iraTemplate
  showModal.value = true;
}

onMounted(() => {
  iraTemplateStore.fetchAll()
})

const emit = defineEmits<{
  create: [insert: IraInsert]
}>()

function handleCreate(insert: IraInsert) {
  emit('create', insert)
  showModal.value = false
}

function handleClose() {
  showModal.value = false
}

</script>

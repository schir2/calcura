<script setup lang="ts">
import type {CommandSequenceWithRelations} from '#shared/types/CommandSequence'
import type {BaseState} from '#shared/types/BaseState'
import BrokerageWorkspaceForm from '~/components/brokerage/WorkspaceForm.vue'
import HsaWorkspaceForm from '~/components/hsa/WorkspaceForm.vue'
import IraWorkspaceForm from '~/components/ira/WorkspaceForm.vue'
import RothIraWorkspaceForm from '~/components/rothIra/WorkspaceForm.vue'
import TaxDeferredWorkspaceForm from '~/components/taxDeferred/WorkspaceForm.vue'
import DebtWorkspaceForm from '~/components/debt/WorkspaceForm.vue'
import ExpenseWorkspaceForm from '~/components/expense/WorkspaceForm.vue'
import EntityProjection from '~/components/common/EntityProjection.vue'
import DebtWorkspaceProjection from '~/components/debt/WorkspaceProjection.vue'
import ExpenseWorkspaceProjection from '~/components/expense/WorkspaceProjection.vue'

type Props = {
  commandSequence: CommandSequenceWithRelations | null
}
const {commandSequence} = defineProps<Props>()

const workspace = useWorkspaceStore()
const orchestrator = orchestratorStore()
const previewStates = ref<BaseState[]>([])
const planAge = computed(() => orchestrator.plan?.age)

const isMobile = ref(false)
onMounted(() => {
  const query = window.matchMedia('(max-width: 768px)')
  isMobile.value = query.matches
  query.addEventListener('change', event => (isMobile.value = event.matches))
})

const placement = computed(() => (isMobile.value ? 'bottom' : 'right'))

const formComponent = computed(() => {
  switch (workspace.modelName) {
    case 'brokerage':
      return BrokerageWorkspaceForm
    case 'hsa':
      return HsaWorkspaceForm
    case 'ira':
      return IraWorkspaceForm
    case 'roth_ira':
      return RothIraWorkspaceForm
    case 'tax_deferred':
      return TaxDeferredWorkspaceForm
    case 'debt':
      return DebtWorkspaceForm
    case 'expense':
      return ExpenseWorkspaceForm
    default:
      return null
  }
})

const projectionComponent = computed(() => {
  switch (workspace.modelName) {
    case 'debt':
      return DebtWorkspaceProjection
    case 'expense':
      return ExpenseWorkspaceProjection
    default:
      return EntityProjection
  }
})

const title = computed(() => {
  const verb = workspace.mode === 'create' ? 'New' : 'Edit'
  return `${verb} ${workspace.modelName ?? 'entity'}`.replace(/_/g, ' ')
})

watch(() => workspace.isOpen, open => {
  if (open) previewStates.value = []
})

function handleSaved() {
  workspace.close()
}
</script>

<template>
  <n-drawer
      v-model:show="workspace.isOpen"
      :placement="placement"
      :width="isMobile ? undefined : 720"
      :height="isMobile ? '85%' : undefined"
  >
    <n-drawer-content :title="title" closable body-content-class="!p-0">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-5">
        <section class="min-w-0">
          <component
              :is="formComponent"
              v-if="formComponent"
              :id="workspace.id"
              :plan-id="workspace.planId"
              :command-sequence="commandSequence"
              @preview="previewStates = $event"
              @saved="handleSaved"
              @cancel="workspace.close()"
          />
          <p v-else class="text-sm text-skin-muted">This entity type has no workspace yet.</p>
        </section>

        <section class="min-w-0 space-y-4">
          <component
              :is="projectionComponent"
              v-if="workspace.modelName"
              :states="previewStates"
              :model-name="workspace.modelName"
              :plan-age="planAge"
          />
          <div class="rounded border border-dashed border-skin-base p-3 text-xs text-skin-muted">
            <div class="flex items-center gap-1 font-medium">
              <base-ico name="info"/>
              About this {{ (workspace.modelName ?? 'entity').replace(/_/g, ' ') }}
            </div>
            <p class="mt-1">
              Educational guidance will live here — who it's for and when to use it. (Coming soon)
            </p>
          </div>
        </section>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>
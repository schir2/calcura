<script lang="ts" setup>
import type {Plan, PlanInsert} from '#shared/types/Plan'
import {planRules} from '~/utils/validators/planRules'
import {planDefaults} from '~/constants/planConstants'
import PlanFieldsGoal from '~/components/plan/fields/Goal.vue'
import PlanFieldsRates from '~/components/plan/fields/Rates.vue'
import PlanFieldsTimeline from '~/components/plan/fields/Timeline.vue'
import IncomeWorkspaceForm from '~/components/income/WorkspaceForm.vue'

definePageMeta({
  title: 'New Plan',
  layout: 'default',
  middleware: 'auth',
})

const planStore = usePlanStore()
const profileStore = useProfileStore()
const orchestrator = orchestratorStore()
const commandSequenceStore = useCommandSequenceStore()

const step = ref<1 | 2>(1)
const expandedAdvanced = ref<string[]>([])
const createdPlanId = ref<number | null>(null)
const model = ref<Partial<Plan>>({...planDefaults})

const {formRef, pending, rules, onSubmit} = useNaiveForm(model)
rules.value = planRules(model).rules

// ADR 014: the profile SEEDS a new plan — it is never a live reference, and never back-synced.
// Seed once, on the first non-null profile, so a late-arriving profile cannot clobber user edits.
function ageFromBirthday(birthday: string | null | undefined): number | undefined {
  if (!birthday) return undefined
  const dob = new Date(birthday)
  if (Number.isNaN(dob.getTime())) return undefined
  const today = new Date()
  const hasHadBirthdayThisYear =
      today.getMonth() > dob.getMonth() ||
      (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate())
  return today.getFullYear() - dob.getFullYear() - (hasHadBirthdayThisYear ? 0 : 1)
}

const seeded = ref(false)
watch(() => profileStore.profile, profile => {
  if (!profile || seeded.value) return
  seeded.value = true
  const age = ageFromBirthday(profile.birthday)
  if (age !== undefined) model.value.age = age
  if (profile.life_expectancy != null) model.value.life_expectancy = profile.life_expectancy
}, {immediate: true})

// The income form needs a persisted plan (it writes the income immediately so linked accounts have
// a real income_id to point at), so completing step 1 creates the plan — see ADR 015's amendment.
function handleCreatePlan() {
  onSubmit(async () => {
    const {id: _id, ...insert} = model.value as Plan
    const created = await planStore.create(insert as PlanInsert)
    createdPlanId.value = created.id
    await orchestrator.load(created.id)
    step.value = 2
  })
}

const activeCommandSequence = computed(() =>
    commandSequenceStore.list.find(sequence => sequence.plan_id === createdPlanId.value) ?? null)

function goToPlan() {
  return navigateTo({name: 'plans-id', params: {id: createdPlanId.value}})
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-6 space-y-6">
    <header class="space-y-1">
      <h1 class="text-4xl">Create a plan</h1>
      <p class="text-skin-muted text-lg">
        {{ step === 1 ? 'When would you like to retire?' : 'What are you earning?' }}
      </p>
    </header>

    <n-steps :current="step" size="small">
      <n-step title="Your goal"/>
      <n-step title="Your income"/>
    </n-steps>

    <n-card v-if="step === 1">
      <n-form ref="formRef" :model="model" :rules="rules">
        <n-form-item path="name" label="Plan name">
          <n-input v-model:value="model.name" placeholder="e.g. Retire at 60"/>
        </n-form-item>

        <div class="text-sm font-medium text-skin-base mb-2">Retirement goal</div>
        <PlanFieldsGoal v-model="model"/>

        <n-collapse v-model:expanded-names="expandedAdvanced" class="mt-5">
          <n-collapse-item title="Advanced" name="advanced">
            <p class="text-xs text-skin-muted mb-4">
              Sensible defaults are already filled in. Change these only if you want to.
            </p>
            <PlanFieldsRates v-model="model"/>
            <div class="border-t border-skin-base my-4"/>
            <PlanFieldsTimeline v-model="model"/>
          </n-collapse-item>
        </n-collapse>
      </n-form>

      <template #action>
        <div class="flex justify-end gap-2">
          <n-button quaternary @click="navigateTo('/plans')">Cancel</n-button>
          <n-button type="primary" :loading="pending" @click="handleCreatePlan">Next</n-button>
        </div>
      </template>
    </n-card>

    <n-card v-else>
      <p class="text-sm text-skin-muted mb-4">
        Add what you earn — every contribution to a 401(k), IRA or Roth is a share of an income, so
        this is what the rest of the plan builds on. You can add accounts funded by it right here.
        Your plan is already saved; skip this and add it later if you'd rather.
      </p>

      <!-- The form's own Cancel cancels *the income*, not the plan — which is exactly the skip. -->
      <IncomeWorkspaceForm
          :id="null"
          :plan-id="createdPlanId"
          :command-sequence="activeCommandSequence"
          @saved="goToPlan"
          @cancel="goToPlan"
      />
    </n-card>
  </div>
</template>

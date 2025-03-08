<script setup lang="ts">

import type {Debt} from "~/types/Debt";
import {ModelName} from "~/types/ModelName";
import {calculateDebtPayment} from "~/models/debt/DebtManager";

interface Props {
  debt: Debt
}

const props = defineProps<Props>()

const showModal = ref<boolean>(false)

const emit = defineEmits(['delete', 'update', 'create', 'remove']);

function handleDelete() {
  emit('delete', props.debt);
}

function handleUpdate(debt: Partial<Debt>) {
  emit('update', debt)
  showModal.value = false;
}


function handleCreate(debtPartial: Partial<Debt>) {
  emit('create', debtPartial)
  showModal.value = false;
}


function handleRemove() {
  emit('remove', props.debt);
}

function handleClose() {
  showModal.value = false;
}

function handleEdit() {
  showModal.value = true;
}
</script><template>
  <n-modal v-model:show="showModal">
    <DebtForm :initialValues="debt" mode="edit"
              @delete="handleDelete"
              @create="handleCreate"
              @update="handleUpdate"
              @cancel="handleClose"
    />
  </n-modal>
  <command-list-item
      @edit="handleEdit" @remove="handleRemove" @delete="handleDelete"
      :title="debt.name"
      :modelName="ModelName.Debt"
      :tags="[
          {label: debt.frequency, iconName: 'frequency'},
          {label: `Interest ${debt.interestRate}%`, iconName: 'interest', hide: debt.interestRate === 0},
      ]"
  >
    <template #summary>
      -${{ $humanize.intComma(calculateDebtPayment(debt, debt.principal)) }}/year
    </template>
  </command-list-item>

</template>
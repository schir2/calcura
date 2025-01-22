<template>

      <VueDraggableNext v-if="list"
                        class="dragArea list-group w-full" :list="list" @change="onChange">
        <div
            class="list-group-item bg-skin-surface m-1 p-3 rounded-md text-center"
            v-for="element in list"
            :key="element.name"
        >
          {{ element.name }}
          <n-tag>{{ element.label }}</n-tag>
        </div>
      </VueDraggableNext>

</template>
<script setup lang="ts">
import type Command from "~/models/common/Command";
import {VueDraggableNext} from "vue-draggable-next";

interface Props {
  commands: Command[]
}

const props = defineProps<Props>()
const list = ref(props.commands)

const emits = defineEmits(['update'])

function onChange() {
  emits('update', [...list.value])
}
</script>

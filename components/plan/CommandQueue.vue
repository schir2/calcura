<template>

  <VueDraggableNext v-if="list"
                    class="dragArea list-group w-full" :list="list" @change="onChange">
    <p
        class="list-group-item bg-skin-surface m-1 p-3 rounded-md text-center cursor-pointer flex justify-between items-center"
        v-for="element in list"
        :key="element.name"
    >
          <span class="flex items-center gap-3">
          <Icon class="text-2xl" name="mdi:drag"/>
      {{ element.name }}
          </span>
      <n-tag>{{ element.label }}</n-tag>
    </p>
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

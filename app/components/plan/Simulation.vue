<template>


</template>
<script setup lang="ts">
import type {CommandSequence} from "#shared/types/CommandSequence";

type Props = {
  commandSequence: CommandSequence
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update-command-sequence': [sequence: CommandSequence]
}>()
</script>
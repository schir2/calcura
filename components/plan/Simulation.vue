<template>


</template>
<script setup lang="ts">
import type {CommandSequence} from "~/types/CommandSequence";

interface Props {
  commandSequence: CommandSequence
}

const props = defineProps<Props>()

const emit = defineEmits(['update-command-sequence'])
</script>
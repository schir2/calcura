<script setup lang="ts">
import type {Plan} from "~/types/Plan";
import {FormatType} from "~/types/FormatType";

interface Props {
  plan: Plan
}
const props = defineProps<Props>()

</script>

<template>
  {{ plan.name}}{{formatValue(plan.editedAt, FormatType.DateTime)}}
</template>
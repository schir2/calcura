<script setup lang="ts">
import type {Plan} from "#shared/types/Plan";
import {FormatType} from "~/types/FormatType";

type Props = {
  plan: Plan
}
const props = defineProps<Props>()

</script>

<template>
  {{ plan.name }}{{ formatValue(plan.edited_at, FormatType.DateTime) }}
</template>
<template>
  <h1 class="text-4xl">Retirement Plans</h1>
</template>
<script lang="ts" setup>
import {dbService} from "~/services/dbService";

console.log(dbService.table('plans'))
</script>

<script setup lang="ts">
const client = useSupabaseClient()

const { data: brokerages } =  await useAsyncData('brokerages', async () =>{
  await client.from('brokerage').select('')
})
</script>
<template>
  <span>{{brokerages}}</span>
</template>
<template>
  <section id="planBasicInfo" class="grid grid-cols-4 gap-3">
    <n-form-item path="name" label="Name">
      <n-input v-model:value="modelRef.name"></n-input>
    </n-form-item>

    <n-form-item path="age" label="Age">
      <n-input-number class="w-full" v-model:value="modelRef.age"/>
    </n-form-item>

    <n-form-item path="year" label="Year">
      <n-input-number class="w-full" v-model:value="modelRef.year"/>
    </n-form-item>

    <n-form-item path="lifeExpectancy" label="Life Expectancy">
      <n-input-number class="w-full" v-model:value="modelRef.lifeExpectancy"/>
    </n-form-item>
  </section>
</template>
<script lang="ts" setup>
const modelRef = defineModel<Plan>()
</script>
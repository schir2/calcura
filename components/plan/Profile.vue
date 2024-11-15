<script setup lang="ts">
const profile = ref({
  name: '',
  age: 38,
  lifeExpectancy: 38,
})
</script>

<template>
  <CommonCard>
    <form>
      <h2 class="text-2xl">Profile</h2>
      <FormInput name="name" type="text" label="Name" v-model="profile.name"/>
      <FormInput name="age" type="number" label="Age" v-model="profile.age" :rules="{min_value:0, max_value:120, required:true}"/>
      <FormInput name="lifeExpectancy" type="number" label="Life Expectancy" :rules="{min_value:profile.age, max_value:120, required:true}" v-model="profile.lifeExpectancy"/>
    </form>
  </CommonCard>
</template>

<style scoped>

</style>
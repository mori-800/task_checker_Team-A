<script setup>

const props = defineProps({
  tasks: Object
})
const taskStatusElements = [
    "ToDo",
    "Pending",
    "Doing(ToDay)",
    "WIP",
    "Check",
    "Done",
  ]
</script>

<template>
  <select v-model="tasks.status" class="select" :value="tasks.status">
    <option :value="index" v-for="(status,index) in taskStatusElements" :key="index">{{ status }}</option>
  </select>
</template>
<style scoped>
.select {
  width: 150px;
  height: 25px;
  font-size: 15px;
  color: rgb(70, 70, 70);
  border: none;
  border-bottom: thin solid #cfcfcf;
  outline: none;
  cursor: pointer;
}
</style>
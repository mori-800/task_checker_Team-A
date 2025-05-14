//以下すべてオリジナルです 森

<script setup>
import Task from './Task.vue'
import { ref, onMounted } from 'vue'
import api from '../api/axios'

onMounted(async() => {
  const response = await api.get('/tasks');
  tasks.value = response.data;
})
</script>

<template>
  <Task>aaaaa</Task>
</template>
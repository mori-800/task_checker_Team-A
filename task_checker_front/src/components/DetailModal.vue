<!-- DetailModal.vue -->
<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <h2>Task Details</h2>
      <p><strong>Title:</strong> {{ task.name }}</p>
      <p><strong>Description:</strong> {{ task.explanation }}</p>
      <p><strong>Deadline:</strong> {{ formattedDeadlineDate }}</p>
      <!-- <div v-if="task.image_url" class="image-container">
        <img :src="task.image_url" alt="Task Image" /> -->
      <!-- </div> -->
      <button @click="closeModal">Close</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  task: Object,
  isVisible: Boolean
})

const emit = defineEmits(['update:isVisible'])

const formattedDeadlineDate = computed(() => {
  const date = new Date(props.task.deadlineDate)
  return date.toLocaleDateString('ja-JP')
})

const closeModal = () => {
  emit('update:isVisible', false)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

button {
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>

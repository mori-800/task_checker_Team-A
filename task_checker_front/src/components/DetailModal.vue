<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <h2>Task Details</h2>

      <p><strong>Title:</strong> {{ localTask.name }}</p>
      <p><strong>Description:</strong> {{ localTask.explanation }}</p>
      <p><strong>Deadline:</strong> {{ formattedDeadlineDate }}</p>

      <div v-if="localTask.image_url" class="image-container">
        <img :src="localTask.image_url" alt="Task Image" />
      </div>

      <button @click="openEditModal">Edit</button>

      <div v-if="isEditModalVisible" class="edit-modal-overlay" @click="closeEditModal">
        <div class="edit-modal-content" @click.stop>
          <h3>Edit Task</h3>
          <form @submit.prevent="saveChanges">
            <label for="taskName">Task Name:</label>
            <input type="text" id="taskName" v-model="editedTask.name" required />

            <label for="taskExplanation">Explanation:</label>
            <textarea id="taskExplanation" v-model="editedTask.explanation" required></textarea>

            <button type="submit">Save</button>
            <button type="button" @click="closeEditModal">Cancel</button>
          </form>
        </div>
      </div>

      <button @click="closeModal">Close</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  task: Object,
  isVisible: Boolean
})

const emit = defineEmits(['update:isVisible', 'update-task'])

const localTask = ref({ ...props.task })
const editedTask = ref({ ...props.task })

const isEditModalVisible = ref(false)

const formattedDeadlineDate = computed(() => {
  const date = new Date(localTask.value.deadlineDate)
  return date.toLocaleDateString('ja-JP')
})

const openEditModal = () => {
  editedTask.value = { ...localTask.value }
  isEditModalVisible.value = true
}

const closeEditModal = () => {
  isEditModalVisible.value = false
}

const closeModal = () => {
  emit('update:isVisible', false)
}

const saveChanges = () => {
  localTask.value = { ...editedTask.value }
  isEditModalVisible.value = false

  // 🔥 編集結果を親(Task.vue)に送信
  emit('update-task', localTask.value)
}

// propsが変わったら自動で更新
watch(() => props.task, (newTask) => {
  localTask.value = { ...newTask }
  editedTask.value = { ...newTask }
})
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

.image-container img {
  width: 100%;
  margin-top: 10px;
}

button {
  margin-top: 10px;
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

.edit-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
}

.edit-modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 350px;
}

input, textarea {
  width: 100%;
  margin-top: 6px;
  padding: 8px;
  margin-bottom: 12px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style>

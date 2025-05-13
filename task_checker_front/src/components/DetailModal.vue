<template>
<div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <h2>Task Details</h2>

      <!-- タスク情報表示（ローカル状態を表示） -->
      <p><strong>Title:</strong> {{ localTask.name }}</p>
      <p><strong>Description:</strong> {{ localTask.explanation }}</p>
      <p><strong>Deadline:</strong> {{ formattedDeadlineDate }}</p>

      <!-- 画像があれば表示 -->
      <div v-if="localTask.image_url" class="image-container">
        <img :src="localTask.image_url" alt="Task Image" />
      </div>

      <!-- 編集ボタン -->
      <button @click="openEditModal">Edit</button>

      <!-- 編集用モーダル -->
      <div v-if="isEditModalVisible" class="edit-modal-overlay" @click="closeEditModal">
        <div class="edit-modal-content" @click.stop>
          <h3>Edit Task</h3>
          
          <!-- 編集フォーム -->
          <form @submit.prevent="saveChanges">
            <label for="taskName">Task Name:</label>
            <input
              type="text"
              id="taskName"
              v-model="editedTask.name"
              required
            />

            <label for="taskExplanation">Explanation:</label>
            <textarea
              id="taskExplanation"
              v-model="editedTask.explanation"
              required
            ></textarea>

            <!-- <label for="taskDeadline">Deadline:</label>
            <input
              type="date"
              id="taskDeadline"
              v-model="editedTask.deadlineDate"
              required
            /> -->

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
import { computed, ref, watch } from 'vue'

const props = defineProps({
  task: Object,
  isVisible: Boolean
})

const emit = defineEmits(['update:isVisible'])

// ローカルタスクデータ（表示用）
const localTask = ref({ ...props.task })

// 編集用データ
const editedTask = ref({ ...props.task })

// モーダル状態
const isEditModalVisible = ref(false)

// フォーマット済み日付
const formattedDeadlineDate = computed(() => {
  const date = new Date(localTask.value.deadlineDate)
  return date.toLocaleDateString('ja-JP')
})

// 編集モーダルを開く
const openEditModal = () => {
  editedTask.value = { ...localTask.value }  // 現在のタスク内容で初期化
  isEditModalVisible.value = true
}

// 閉じる処理
const closeEditModal = () => {
  isEditModalVisible.value = false
}

const closeModal = () => {
  emit('update:isVisible', false)
}

// 編集保存 → 表示に反映
const saveChanges = () => {
  // 編集データを表示用に反映
  localTask.value = { ...editedTask.value }

  // 編集モーダルを閉じる
  isEditModalVisible.value = false

  // 必要であれば親にも通知（例：API保存など）
  // emit('updateTask', localTask.value)
}

// タスクが外部から変更された場合にも反映
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

/* 編集モーダル */
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
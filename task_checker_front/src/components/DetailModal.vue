<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <h2>Task Details</h2>

      <!-- タスク情報表示 -->
      <p><strong>Title:</strong> {{ task.name }}</p>
      <p><strong>Description:</strong> {{ task.explanation }}</p>
      <p><strong>Deadline:</strong> {{ formattedDeadlineDate }}</p>

      <!-- 画像があれば表示 -->
      <div v-if="task.image_url" class="image-container">
        <img :src="task.image_url" alt="Task Image" />
      </div>

      <!-- 編集ボタン -->
      <button @click="openEditModal">Edit</button>

      <!-- 編集用のモーダル -->
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
              placeholder="Enter task name"
              required
            />

            <label for="taskExplanation">Explanation:</label>
            <textarea
              id="taskExplanation"
              v-model="editedTask.explanation"
              placeholder="Enter task explanation"
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

      <!-- 閉じるボタン -->
      <button @click="closeModal">Close</button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  task: Object,       // 親コンポーネントから渡されるタスク情報
  isVisible: Boolean  // モーダルの表示状態
})

const emit = defineEmits(['update:isVisible'])

const isEditModalVisible = ref(false)  // 編集用モーダルの表示状態
const editedTask = ref({ ...props.task })  // 編集中のタスクデータ（初期値は渡されたtask）

const formattedDeadlineDate = computed(() => {
  // タスクの期限日を日本の日付形式でフォーマット
  const date = new Date(props.task.deadlineDate)
  return date.toLocaleDateString('ja-JP')
})

// モーダルを閉じる関数
const closeModal = () => {
  emit('update:isVisible', false)
}

// 編集モーダルを表示する関数
const openEditModal = () => {
  isEditModalVisible.value = true
}

// 編集モーダルを閉じる関数
const closeEditModal = () => {
  isEditModalVisible.value = false
}

// 編集した内容を保存する関数
const saveChanges = () => {
  // 編集したタスクデータを保存（ここでは単純にconsole.logしてますが、実際にはAPIに送信する等の処理が必要）
  console.log('Task updated:', editedTask.value)

  // 編集モーダルを閉じる
  closeEditModal()

  // 親コンポーネントに変更を通知する場合（例えば、APIに保存するなど）
  // emit('updateTask', editedTask.value)  // 親コンポーネントで 'updateTask' イベントを受け取るようにする
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

.image-container {
  width: 100%;
  height: auto;
  margin-top: 10px;
}

.image-container img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

/* 編集モーダル用のスタイル */
.edit-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
}

.edit-modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 350px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

form {
  display: flex;
  flex-direction: column;
}

form label {
  margin-top: 10px;
}

form input, form textarea {
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

form button {
  margin-top: 20px;
  background-color: #28a745;
}

form button[type="button"] {
  background-color: #dc3545;
}
</style>
<script setup>
import Select from './Select.vue'
import { computed, ref } from 'vue'
import DetailModal from './DetailModal.vue'

const props = defineProps({
  task: Object
})

// タスクをrefとしてローカルに保持（編集反映のため）
const localTask = ref({ ...props.task })

const isModalVisible = ref(false)

const showDetailModal = () => {
  isModalVisible.value = true
}

// 編集内容を受け取って更新
const handleTaskUpdate = (updatedTask) => {
  localTask.value = { ...updatedTask }
}

const formattedDeadlineDate = computed(() => {
  const date = new Date(localTask.value.deadlineDate)
  return date.toLocaleDateString('ja-JP')
})

const taskStyle = computed(() => {
  const isDeadlineAfterToday = new Date(localTask.value.deadlineDate) > new Date()
  return {
    backgroundColor: isDeadlineAfterToday ? 'white' : 'rgb(250, 194, 194)',
  }
})
</script>

<template>
  <div class="task" :style="taskStyle" @click="showDetailModal">
    <span class="task_date">{{ formattedDeadlineDate }}</span>
    <div class="task_text_contents">
      <h3 class="task_title">{{ localTask.name }}</h3>
      <p class="task_sentence">{{ localTask.explanation }}</p>
    </div>
    <div v-if="localTask.image_url" class="image-container">
      <div class="image-wrapper">
        <img :src="localTask.image_url" class="task-image" />
      </div>
    </div>
    <div class="task_input_contents">
      <Select />
    </div>

    <DetailModal
      :task="localTask"
      :isVisible="isModalVisible"
      @update:isVisible="isModalVisible = $event"
      @update-task="handleTaskUpdate"
    />
  </div>
</template>

<style scoped>
.task {
  background-color: white;
  max-height: 350px;
  width: 300px;
  margin-bottom: 20px;
  border-radius: 5px;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
  position: relative;
  cursor: pointer;
  top: 0;
  transition: top left ease 0.2s;
}

.task:hover {
  top: -2px;
  left: -2px;
  box-shadow: 0 5px 8px rgba(0, 0, 0, 0.1);
}

.task_text_contents {
  padding: 30px 45px 0 20px;
}

.task_title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: rgb(70, 70, 70);
  font-size: 15px;
  margin-bottom: 10px;
}

.task_sentence {
  overflow: hidden;
  color: rgb(70, 70, 70);
  font-size: 12px;
  text-align: start;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.task_date {
  position: absolute;
  top: 20px;
  left: 20px;
  color: rgb(133, 133, 133);
  font-size: 11px;
}

.task_input_contents {
  padding: 0 20px 20px 20px;
}

.image-container {
  width: 100px;
  height: 100px;
  overflow: hidden;
  margin-left: 20px;
}

.image-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.task-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>

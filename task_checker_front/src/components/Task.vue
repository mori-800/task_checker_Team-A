<script setup>
import Select from './Select.vue'
import { computed,ref } from 'vue'
import FormModal from './FormModal.vue';

const showModal=ref(false);
const props = defineProps({
  task: Object
})
const formattedDeadlineDate = computed(() => {
  const date = new Date(props.task.deadlineDate)
  return date.toLocaleDateString('ja-JP')
})

const genreSelect = (e) => {
  props.task.value.genreId = Number(e.target.value)
}

const closeModal = () => {
  showModal.value = false
}

const taskStyle = computed(() => {
  // 現在の日時より deadlineDate が後であるかをチェック
  const isDeadlineAfterToday = new Date(props.task.deadlineDate) > new Date();
  // 条件に基づいてスタイルオブジェクトを返す
  return {
    backgroundColor: isDeadlineAfterToday ? 'white' : 'rgb(250, 194, 194)',
  };
})

</script>

<template>
  <div class="task" :style="taskStyle">
    <FormModal v-model="showModal" body="detailBody" @close-modal="closeModal" :task="props.task"/>
    <span class="task_date">{{ formattedDeadlineDate }}</span>
    <div @click="showModal=true">
      <div class="task_text_contents">
        <h3 class="task_title">{{ task.name }}</h3>
        <p class="task_sentence">{{ task.explanation}}</p>
      </div>
      <div v-if="task.image_url" class="image-container">
        <div class="image-wrapper">
          <img
            :src="task.image_url"
            class="task-image"
          />
        </div>
      </div>
    </div>
    <div className="task_input_contents">
      <Select @change="genreSelect" :value="props.task.genreId"/>
    </div>
  </div>
</template>

<style>
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
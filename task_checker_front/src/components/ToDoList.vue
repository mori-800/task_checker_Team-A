<script setup>
import MenuIcon from 'vue-material-design-icons/Menu.vue';
import AddCircleIcon from 'vue-material-design-icons/PlusCircleOutline.vue'
import Task from './Task.vue'
import FormModal from './FormModal.vue';

import { ref } from 'vue'
import { useTaskStore } from '../stores/taskStore';

const taskStore = useTaskStore();
const showModal = ref(false)
const showTask = ref(true)

const props = defineProps({
  status: String,
  tasks: Object
})

const toggleShowTasks = () => {
  showTask.value = !showTask.value
}

const closeModal = () => {
  showModal.value = false
}

</script>

<template>
  <div class="task_list">
    <div class="section">
      <MenuIcon class="section_ele" @click="toggleShowTasks"/>
      <span class="section_ele">{{ props.status }}</span>
      <AddCircleIcon
        v-if="props.status == 'ToDo'"
        class="add_circle_outline_icon"
        @click="showModal = true"
      />
      <FormModal v-model="showModal" body="taskBody" @close-modal="closeModal"/>
    </div>
    
    <div class="task_field" v-for="task in props.tasks" :key="task.id" v-if="showTask">
      <Task :task="task"/>
    </div>
  </div>
</template>

<style>
.task_list {
  min-width: 300px;
  width: auto;
  padding: 30px;
  padding-top: 10px;
  /* background: linear-gradient(145deg, #fceaff, #e0f7ff);
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(200, 180, 255, 0.3); */
  font-family: 'Comic Sans MS', 'Segoe UI', cursive;
}

.section {
  display: flex;
  position: relative;
  align-items: center;
  height: 50px;
  width: 300px;
  background-color: #fff0fb;
  box-shadow: 0 5px 10px rgba(255, 200, 250, 0.3);
  border-radius: 12px;
  border: 2px dashed #ffd9f7;
}

.section_ele {
  color: #a060c0;
  margin-left: 15px;
  font-size: 18px;
  font-weight: bold;
  text-shadow: 1px 1px 2px #f9e0ff;
}

.task_field {
  display: flex;
  flex-direction: column;
  max-height: 65vh;
  margin-top: 10px;
  overflow: auto;
  border-radius: 10px;
}

.task_field::-webkit-scrollbar {
  display: none;
}

.section > .add_circle_outline_icon {
  position: absolute;
  right: 10px;
  font-size: 25px;
  color: #a3dfff; /* パステルブルー */
  transition: transform 0.3s ease;
}

.section > .add_circle_outline_icon:hover {
  transform: rotate(15deg) scale(1.2);
  color: #ffb3ef;
}
</style>


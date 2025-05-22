<script setup>
import Header from './Header.vue'
import Select from './Select.vue'
import ToDoList from './ToDoList.vue'
import FormModal from './FormModal.vue'
import AddCircleIcon from 'vue-material-design-icons/PlusCircleOutline.vue'
import { ref, onMounted } from 'vue'
import { useTaskStore } from '../stores/taskStore'
import { useGenreStore } from '../stores/genreStore'
//森の遊び 後で消す
import api from '../api/axios'
const showWarningModal = ref(false)
const overdueTasks = ref([])

const showModal = ref(false);
const taskStore = useTaskStore();
const genreStore = useGenreStore();
const taskStatusElements = [
    "ToDo",
    "Pending",
    "Doing(ToDay)",
    "WIP",
    "Check",
    "Done",
  ]

onMounted(async()=> {
  try{
    await taskStore.fetchAllTasks();
  }catch(error){
    console.log(error)
  }
  try {
    await genreStore.fetchAllGenres();
  }catch(error){
    console.log(error)
  }

  //森の遊び 後で消す
  const res = await api.get('/tasks') // APIで全タスク取得
  const now = new Date()
  overdueTasks.value = res.data.filter(task => new Date(task.deadlineDate) < now)

  if (overdueTasks.value.length > 0) {
    showWarningModal.value = true
  }
})

const changeSelectedGenreId = (e) => {
  const selectGenreId = Number(e.target.value);
  taskStore.filterTasks(selectGenreId);
}

const filterTasksByStatus = (statusIndex) => {
  //statusで受け取った値がtaskStatusの配列の何番目の数値か調べる。
  const index = statusIndex
  //indexとtask.statusの値が同じ場合のみデータ取得する。
  return taskStore.filteredTasks.filter(
     task => task && typeof task.status !== 'undefined' && task.status == index
  );
}

//森の遊び 後で消す
const closeModal = () => {
  showWarningModal.value = false
}

</script>

<template>
  <div class="main">
    <Header/>
    <div class="genre">
      <Select @change="changeSelectedGenreId"/>
      <AddCircleIcon class="add_circle_outline_icon" @click="showModal = true"/>
      <FormModal v-model="showModal" body="genreBody"/>
    </div>

    <div class="contents">
      <div v-for="(status, index) in taskStatusElements" :key="index">
        <ToDoList :tasks="filterTasksByStatus(index)" :status="status"/>
      </div>
    </div>
    <!-- 森の遊び 後で消す -->
     <!-- ⚠️ 警告モーダル -->
    <div v-if="showWarningModal" class="modal-overlay" @click.self="closeModal">
    <div class="warning-modal">
  <div class="warning-content">
    ⚠️ 期限切レノ要件アリ。至急対応サレタシ。
  </div>
</div>

  </div>
  </div>
</template>

<style>
.main {
  width: 100vw;
  height: 100vh;
  background-color: #f6f8f9;
  overflow: hidden;
}

.genre {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  padding-top: 20px;
}

.add_circle_outline_icon {
  margin-left: 10px;
  color: rgb(70, 70, 70);
}

.contents {
  display: flex;
  height: calc(100vh - 120px);
  width: 100%;
  overflow: auto;
}
/* .user-name{
  width: 100%;
} */

 /* 森の遊び 後で消す */
 .modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background-color: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.warning-modal {
  padding: 20px;
  background: repeating-linear-gradient(
    45deg,
    red,
    red 20px,
    black 20px,
    black 40px
  );
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.warning-content {
  background-color: black;
  color: white;
  font-weight: bold;
  padding: 30px 40px;
  border-radius: 8px;
  text-align: center;
  font-size: 1.5rem;
  animation: blinkText 1s infinite alternate;
  text-shadow:
    -1px -1px 0 #ff0000,
     1px -1px 0 #ff0000,
    -1px  1px 0 #ff0000,
     1px  1px 0 #ff0000;
}


.blink {
  animation: blink 1s step-start 0s infinite;
}

.outlined-text {
  /* 白文字 + 黒い縁取り */
  color: white;
  text-shadow:
    -1px -1px 0 #000,
     1px -1px 0 #000,
    -1px  1px 0 #000,
     1px  1px 0 #000;
}

.warning-modal p {
  color: red;
  font-size: 1.5rem;
  font-weight: bold;
}
/* ここまで */
</style>

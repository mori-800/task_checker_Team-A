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
      <h2 class="blink outlined-text" style="font-size: 2rem; color: red;">
        ⚠️ 危険警告 ⚠️
      </h2>
      <p class="outlined-text">
        期限切れのタスクが {{ overdueTasks.length }} 件あります！
      </p>
    </div>
  </div>
  </div>
</template>

<style scoped>
/* メインコンテナ */
.main {
  width: 100vw;
  height: 100vh;
  background-color: #f6f8f9;
  overflow: hidden;
  background: linear-gradient(to top, #f6f8f9, #fff9fb); /* やさしいグラデーション */
  font-family: 'Comic Sans MS', cursive; /* 夢かわフォント */
}

/* ジャンルセクション */
.genre {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  padding-top: 20px;
  background-color: #ffe1fa;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(255, 182, 255, 0.2);
  margin-bottom: 20px;
}

.add_circle_outline_icon {
  margin-left: 10px;
  color: rgb(70, 70, 70);
  font-size: 1.2rem;
}

/* コンテンツセクション */
.contents {
  display: flex;
  height: calc(100vh - 120px);
  width: 100%;
  overflow: auto;
  background-color: #c9f8fe6c;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 2px 10px rgba(255, 182, 255, 0.3);
}

/* ユーザー名セクション（コメントアウト解除で可愛い感じに追加可） */
/* .user-name {
  width: 100%;
  font-size: 18px;
  text-align: center;
  color: #703c85;
  font-family: 'Comic Sans MS', cursive;
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
  padding: 30px;
  border: 5px solid red;
  text-align: center;
  border-radius: 12px;
  color: white;
  font-weight: bold;
  background: repeating-linear-gradient(
    45deg,
    #f7e600,
    #f7e600 20px,
    #000 20px,
    #000 40px
  );
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

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
  font-size: 28px;
  color: #a3dfff; /* パステルブルー */
  border-radius: 50%; /* まんまるに */
  padding: 8px;
  margin-left: 12px;

  transition: all 0.3s ease;
  cursor: pointer;

  /* ふわふわ浮いてる感じ */
  animation: floaty 3s ease-in-out infinite;
}

/* ホバー時にちょっときらめく */
.add_circle_outline_icon:hover {
  transform: rotate(15deg) scale(1.2);
  color: #ffb3ef;
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
  background-color: rgba(176, 174, 176, 0.6); /* 淡いピンクパープルの半透明 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  backdrop-filter: blur(3px);
}

.warning-modal {
  padding: 20px;
  background: repeating-linear-gradient(
    45deg,
    #ffe6f7,
    #ffe6f7 20px,
    #e6f0ff 20px,
    #e6f0ff 40px
  );
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(255, 182, 255, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px dashed #ffccf9;
}

.warning-content {
  background-color: #fff0fb;
  color: #452d3c;
  font-weight: bold;
  padding: 30px 40px;
  border-radius: 16px;
  text-align: center;
  font-size: 1.5rem;
  animation: sparkleFade 1.5s infinite alternate;
  text-shadow:
    1px 1px 3px #ffb6f9,
    -1px -1px 2px #b5e0ff;
}

/* キラキラアニメーション風 */
@keyframes sparkleFade {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0.8;
    transform: scale(1.03);
  }
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

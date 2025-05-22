<script setup>
import Header from './Header.vue'
import Select from './Select.vue'
import ToDoList from './ToDoList.vue'
import FormModal from './FormModal.vue'
import AddCircleIcon from 'vue-material-design-icons/PlusCircleOutline.vue'
import { ref, onMounted } from 'vue'
import { useTaskStore } from '../stores/taskStore'
import { useGenreStore } from '../stores/genreStore'

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
</style>

<script setup>
import { onMounted, watch, computed} from 'vue'
import { useRoute } from 'vue-router'
import Header from './Header.vue'
import { useTaskStore } from '../stores/taskStore';
import Task from './Task.vue';

const route = useRoute()
const taskStore = useTaskStore();

const searchQuery = computed(() => route.query.q || '')

const performSearch = async (query) => {
  try {
    await taskStore.taskSearch(query);
  } catch (error) {
    console.error('検索に失敗しました:', error)
  }
}

watch(() => route.query.q, (newQuery) => {
  performSearch(newQuery)
})

onMounted(async () => {
  if (searchQuery.value) {
    await taskStore.taskSearch(searchQuery.value);
    console.log(taskStore.searchResults)
  }
})
</script>

<template>
  
  <div class="main">
    <Header />
    <div class="contents">
      <h2 class="search-title">検索結果</h2> <!-- ここを追加 -->
      <div class="task_field" v-for="task in taskStore.searchResults" :key="task.id" >
        <Task :task="task"/>
      </div>
    </div>
    
  </div>
</template>

<style scoped>
.main {
  background-color: #dcf2fc;
  margin: 0;
  padding: 0;
  min-height: 100vh;
}
.contents{
  padding-left: 2%;
  overflow-y: auto;
}
/* 検索結果タイトル */
.search-title {
  font-size: 24px;
  font-weight: bold;
  color: #604d72;
  margin: 24px 0 16px 0;
  font-family: 'Comic Sans MS', 'Hiragino Maru Gothic Pro', 'Yu Gothic UI', sans-serif;
  text-shadow: 1px 1px 3px #ffccf9, 0 0 6px #ffc5ec;
  background-color: #fceaff;
  padding: 8px 16px;
  border-radius: 12px;
  display: inline-block;
  /* box-shadow: 0 2px 6px rgba(255, 204, 249, 0.4); */
  margin-left: 8px; /* ←少し右にずらす */
}

/* タスクフィールド */
.task_field {
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 10px;
}

</style>
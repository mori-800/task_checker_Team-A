<script setup>
import { ref, onMounted, computed } from 'vue'
import Header from './Header.vue'
import Task from './Task.vue'
import api from '../api/axios'
import { auth, onAuthStateChanged } from '../firebase'

const currentUser = ref(null)
const myTasks = ref([])

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentUser.value = user
      try {
        const token = await user.getIdToken()
        const response = await api.get('/tasks/mypage', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        // 自分が作成したタスクのみを格納
        myTasks.value = response.data.filter(task => task.makerId === user.uid)
      } catch (error) {
        console.error("マイページのタスク取得失敗:", error)
      }
    } else {
      currentUser.value = null
    }
  })
})

// タスクを期限順でソートした表示用リスト
const sortedTasks = computed(() => {
  return [...myTasks.value].sort((a, b) => new Date(a.deadlineDate) - new Date(b.deadlineDate))
})
</script>

<template>
  <Header />

  <div class="my-page">
    <h2 class="mp_title">マイページ - 投稿タスク一覧</h2>

    <div v-if="sortedTasks.length" class="task-container">
      <Task v-for="task in sortedTasks" :key="task.id" :task="task" />
    </div>

    <div v-else>
      <p class="not-found">投稿が見つかりませんでした。</p>
    </div>
  </div>
</template>

<style scoped>
.mp_title {
  font-size: 1.2rem;
  margin-left: 2%;
  color: #cc66ff;
  font-weight: bold;
  text-shadow: 1px 1px #fff0f5;
  font-family: 'Comic Sans MS', cursive, sans-serif;
}

.task-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-left: 5%;
  margin-top: 10px;
}


.task-card {
  background: linear-gradient(to bottom right, #ffe6fa, #e0f7ff);
  border: 2px dashed #ffccf9;
  padding: 1rem;
  margin-left: 5px;
  width: calc(23% - 15px); /* 4列表示を維持 */
  border-radius: 16px;
  box-sizing: border-box;
  box-shadow: 0 4px 8px rgba(255, 182, 255, 0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  color: #703c85;
}

.task-card:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 12px rgba(255, 182, 255, 0.4);
}

.not-found {
  margin-left: 3%;
  color: #9999cc;
  font-style: italic;
  font-size: 1rem;
}
</style>

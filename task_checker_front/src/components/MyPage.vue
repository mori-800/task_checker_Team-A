<script setup>
import { ref, onMounted } from 'vue'
import Header from './Header.vue'
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

function getImageUrl(imagePath) {
  return `http://localhost:3000${imagePath}`
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

function getStatusText(status) {
  const statuses = {
    0:"ToDo",
    1:"Pending",
    2:"Doing(ToDay)",
    3:"WIP",
    4:"Check",
    5:"Done",
  }
  return statuses[status] ?? '不明'
}
</script>

<template>
  <Header />

  <div class="my-page">
    <h2 class="mp_title">マイページ - 投稿タスク一覧</h2>

    <div v-if="myTasks.length" class="task-container">
      <div v-for="task in myTasks" :key="task.id" class="task-card">
        <h3>{{ task.name }}</h3>
        <p>締切: {{ formatDate(task.deadlineDate) }}</p>
        <p>詳細: {{ task.explanation }}</p>
        <p>ステータス: {{ getStatusText(task.status) }}</p>
        <img
          v-if="task.image_url"
          :src="getImageUrl(task.image_url)"
          alt="task image"
          style="width: 190.5px; height: 133.5px;"
        />
      </div>
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

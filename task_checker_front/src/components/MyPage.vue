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
      <p class="not-found">投稿が見つかりませんでした😿</p>
    </div>
  </div>
</template>

<style scoped>
.my-page {
  background: linear-gradient( #dcf2fc);
  min-height: 100vh;
  padding-bottom: 40px;
  padding-top: 20px;
  border-radius: 20px;
  box-shadow: inset 0 0 20px rgba(255, 200, 255, 0.2);
}

/* 見出し */
.mp_title {
  font-size: 1.6rem;
  margin-left: 5%;
  color: #d276d2;
  font-weight: bold;
  text-shadow: 2px 2px #fceaff;
  font-family: 'Dancing Script', 'Comic Sans MS', cursive, sans-serif;
}

/* タスク一覧 */
.task-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-left: 5%;
  margin-top: 20px;
}

/* タスクがない場合の表示 */
.not-found {
  margin-left: 5%;
  color: #b499ff;
  font-style: italic;
  font-size: 1.1rem;
  background-color: #fdf5ff;
  padding: 12px 20px;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(210, 180, 255, 0.3);
  font-family: 'Dancing Script', 'Comic Sans MS', cursive, sans-serif;
}

</style>

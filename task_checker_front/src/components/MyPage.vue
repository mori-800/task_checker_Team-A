//以下すべてオリジナルです 森

<script setup>
import { ref,onMounted, computed} from 'vue'
import Header from './Header.vue'
import { useTaskStore } from '../stores/taskStore';
import Task from './Task.vue';
import  api from '../api/axios';
import { auth, onAuthStateChanged } from '../firebase';

const taskStore = useTaskStore();
const currentUser = ref(null);

onMounted(async() => {
  const response = await api.get('/tasks');
  Task.value = response.data;
  },

  auth.onAuthStateChanged((user) => {
    // userの値が存在していたら、currenUserオブジェクトの値をuser.valueにする
    if (user) {
      currentUser.value = auth.currentUser;
    } else {
      currentUser.value = null;
    }
  })
)

//以下ShareWhiZから輸入 重複する部分は削除 森
import { getAuth } from 'firebase/auth';

const userEmail = ref('');

onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userEmail.value = user.email;
    }
  });

  taskStore.fetchAllTasks();
});

const myTasks = computed(() => {
  return taskStore.tasks.filter(task => task.email === userEmail.value);
});

function getImageUrl(imagePath) {
  return `http://localhost:3000${imagePath}`;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}


</script>

<template>
  <Header />
<!-- 全タスク（props経由の tasks でなく、store から取得するように変更）アサイン機能完成次第調整します森 -->
<div v-for="task in taskStore.tasks" :key="task.id">
  <Task :task="task" />
</div>

  <!-- 以下はShareWhiZから輸入 森 -->
  <div>
    <h2 class="mp_title">投稿タスク一覧</h2>
    <div v-if="myTasks.length">
      <div v-for="task in myTasks" :key="task.id">
        <div>
          <h3>{{ task.title }}</h3>
        </div>
        <div>
          <p>{{ task.explanation }}</p> 
          <img
            :src="getImageUrl(task.image_url)"
            alt="task image"
            v-if="task.image_url"
            style="width: 190.5px; height: 133.5px;"
          />
        </div>
        <div>
          <div>
            {{ formatDate(task.created_at) }}
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>投稿が見つかりませんでした。</p>
    </div>
  </div>
</template>
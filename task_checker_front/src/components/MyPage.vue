//以下すべてオリジナルです 森

<script setup>
import { ref,onMounted, watch, computed} from 'vue'
import { useRoute } from 'vue-router'
import Header from './Header.vue'
import { useTaskStore } from '../stores/taskStore';
import Task from './Task.vue';
import  api from '../api/axios';
import { auth, onAuthStateChanged } from '../firebase';


const route = useRoute()
const taskStore = useTaskStore();
const currentUser = ref(null);

const props = defineProps({
  status: String,
  tasks: {
    type: Array,
    default: () => []
  }
})

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

</script>

<template>
  <Header />
  <!-- tasksは複数のタスクの配列なので繰り返しで<Task>に渡す 森 -->
  <div v-for="task in tasks" :key="task.id">
    <Task :task="task" />
  </div>
  <ShowList :task="task"/>
</template>
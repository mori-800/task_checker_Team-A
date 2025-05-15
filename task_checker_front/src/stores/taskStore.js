import { defineStore } from 'pinia'
import api from '../api/axios'
import { ref } from 'vue'

export const useTaskStore = defineStore('task', () => {
  const tasks = ref([]);
  const filteredTasks = ref([]);
  const searchResults = ref([]);

  async function fetchAllTasks () {
    try{
      const response = await api.get('/tasks')
      tasks.value = response.data;
      filteredTasks.value = tasks.value;
    }catch(error){
      console.log('タスクデータの取得ができませんでした', error);
    }
  }

  // ジャンルデータ変更に伴うタスクのフィルタリング
  async function filterTasks(genreId) {
    //取得したselectedGenreIdとtaskのidが同一だったらtasks.valueのデータを更新
    if(!genreId) {
      filteredTasks.value = [...tasks.value];
    } else {
      filteredTasks.value = tasks.value.filter(task => genreId === task.genreId)
    }
  }

  async function addTask(newTask) {
    try{
      const formData = new FormData();
      formData.append('name', newTask.name);
      formData.append('explanation', newTask.explanation);
      formData.append('deadlineDate', newTask.deadlineDate);
      formData.append('status', newTask.status);
      formData.append('genreId', newTask.genreId);
      formData.append('image_url', newTask.image_url);
      const response = await api.post('/tasks', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const addedTask = response.data;
      tasks.value.push(addedTask);
    }catch(error){
      console.log('タスクデータの保存ができませんでした', error);
    }
  }

  async function taskSearch(query) {
    if (!query) return;
    try {
      const response = await api.get('/search', {
        params: { q: query },
      });
      searchResults.value = response.data; // 検索結果を保存
      console.log(searchResults.value)
    } catch (error) {
      console.error('検索に失敗しました:', error);
    }
  }

  async function updateTasks(taskId,updateTask) {
    console.log("id:",taskId)
    console.log("タスクデータ:",updateTask)
    if(!taskId) return;
    try{
      let payload;
      if (updateTask.image_url instanceof File) {
        console.log("ファイルあるらしい")
        payload = new FormData();
        payload.append('name', updateTask.name);
        payload.append('explanation', updateTask.explanation);
        payload.append('deadlineDate', updateTask.deadlineDate);
        payload.append('status', updateTask.status);
        payload.append('genreId', updateTask.genreId);
        payload.append('image_url', updateTask.image_url); // imageとして送信
      } else {
        payload = updateTask; // 通常のJSON送信
      }
      const response= await api.put(`/tasks/${taskId}`,payload,{
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const index = tasks.value.findIndex(t => t.id === taskId);
      if (index !== -1) {
       tasks.value[index]= response.data;
      }
    }catch(error){
      console.error("編集ミス",error);
    }
    
  }
 return { tasks, filteredTasks, fetchAllTasks, filterTasks, addTask, taskSearch, updateTasks,searchResults}
})
 
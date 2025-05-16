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
  async function updateTasks(taskId, updateTask) {
    if (!taskId) return;
    try {
      const response = await api.put(`/tasks/${taskId}`, updateTask);

      const index = tasks.value.findIndex((t) => t.id === taskId);
      if (index !== -1) {
        tasks.value[index] = response.data;
      }
    } catch (error) {
      console.error("編集ミス", error);
    }
  }
    async function deleteTasks(taskId) {
    if(!taskId) return;
    try{
      const response = await api.delete('/tasks',{
        params:{id: taskId},
      })
      const deletedTask = response.data;
      const deleteTask=tasks.value.findIndex(t =>t.id === deletedTask.id);
      tasks.value.splice(deleteTask,1);
    }catch(error){
      console.error("フロント側で削除の失敗",error)
    }
  }

 return { tasks, filteredTasks, fetchAllTasks, filterTasks, addTask, taskSearch, updateTasks, deleteTasks,searchResults}
})
 
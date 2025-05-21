import { defineStore } from 'pinia'
import api from '../api/axios'
import { ref } from 'vue'
import { auth } from '../firebase' // ← auth も必要なので忘れずに追加

export const useTaskStore = defineStore('task', () => {
  const tasks = ref([]);
  const filteredTasks = ref([]);
  const searchResults = ref([]);

  async function fetchAllTasks () {
    try {
      const response = await api.get('/tasks');
      tasks.value = response.data;
      filteredTasks.value = tasks.value;
    } catch (error) {
      console.log('タスクデータの取得ができませんでした', error);
    }
  }

  // ジャンルデータ変更に伴うタスクのフィルタリング
  async function filterTasks(genreId) {
    //取得したGenreIdとtaskのidが同一だったらtasks.valueのデータを更新
    if (!genreId) {
      filteredTasks.value = [...tasks.value];
    } else {
      filteredTasks.value = tasks.value.filter(task => genreId === task.genreId);
    }
  }
  //タスクの投稿 river
  async function addTask(newTask) {
    console.log(newTask)
    try {
      const formData = new FormData();
      formData.append('name', newTask.name);
      formData.append('explanation', newTask.explanation);
      formData.append('deadlineDate', newTask.deadlineDate);
      formData.append('status', newTask.status);
      formData.append('genreId', newTask.genreId);
      formData.append('makerId', auth.currentUser.uid); // これは送ってOK！バックで makerId に変換して使う
      formData.append('assigneeId', newTask.assigneeId);

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
  //タスクを検索
  async function taskSearch(query) {
    if (!query) return;
    try {
      const response = await api.get('/search', {
        params: { q: query },
      });
      searchResults.value = response.data;
      console.log(searchResults.value)
    } catch (error) {
      console.error('検索に失敗しました:', error);
    }
  }
  //タスクをアップデートする river
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
  //タスクの削除 river
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
  //ステータスの変更 river
  async function changeTasksStatus(task) {
    try{
      const response = await api.put(`/tasks/${task.id}/status`, {status: task.status});

      // responseの商品idと合致する商品をgoods内から探してIndexを取得する
      const index = tasks.value.findIndex(t => t.id === response.data.id)
      // Indexが取得できたら、該当データのstatusIdを更新する。
    }catch(error){
      console.log('ステータス変更に失敗しました', error);
    }
  }

 return { 
    tasks, 
    filteredTasks, 
    fetchAllTasks, 
    filterTasks, 
    addTask, 
    taskSearch, 
    updateTasks, 
    deleteTasks,
    changeTasksStatus,
    searchResults
  }
})

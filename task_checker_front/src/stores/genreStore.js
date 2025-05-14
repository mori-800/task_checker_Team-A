import { defineStore } from 'pinia'
import api from '../api/axios'
import { ref } from 'vue'

export const useGenreStore = defineStore('genre', () => {
  const genres = ref([]);
  const filteredGenres = ref([]);
  
  async function fetchAllGenres () {
    try{
      const response = await api.get('/genres')
      genres.value = response.data;
      filteredGenres.value = genres.value;
    }catch(error){
      console.log('タスクデータの取得ができませんでした', error);
    }
  }
  // ジャンルデータ変更に伴うタスクのフィルタリング
  async function filterGenres(genreId) {
    //取得したselectedGenreIdとtaskのidが同一だったらtasks.valueのデータを更新
    if(!genreId) {
      console.log(genreId)
      filteredGenres.value = [...genres.value];
      console.log(filteredGenres.value)
    } else {
      filteredGenres.value = genres.value.filter(genre => genreId === genre.id)
    }
  }

  return { genres, fetchAllGenres,filterGenres}
})
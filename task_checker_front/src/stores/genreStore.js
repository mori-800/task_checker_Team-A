import { defineStore } from 'pinia'
import api from '../api/axios'
import { ref } from 'vue'
export const useGenreStore = defineStore('genre', () => {
  const genres = ref([]);
  
  async function fetchAllGenres () {
    try{
      const response = await api.get('/genres')
      genres.value = response.data;
    }catch(error){
      console.log('タスクデータの取得ができませんでした', error);
    }
  }


   // 保存処理を実施するためのリクエスト
  async function addGenre(newGenre){
    try {
      const response = await api.post('/genres', newGenre)
      const addedGenre = response.data
      // 追加したジャンルデータをgenresに追加する。
      genres.value.push({
        id: addedGenre.id,
        name: addedGenre.name
      })
    } catch (error) {
      console.log("保存ができませんでした", error);
    }
  }
  return { genres, fetchAllGenres, addGenre }

})
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


   // 保存処理を実施するためのリクエスト　吉田
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

   // 削除処理を実施するためのリクエスト　吉田
  async function removeGenre(removeId) {
    try {
      // サーバーからジャンルを削除
      await api.delete(`/genres/${removeId}`);
      // genresの配列からも、削除したgenreを削除する。
      genres.value = genres.value.filter(genre => genre.id !== removeId);
    } catch (error) {
        console.error('ジャンルの削除に失敗しました。', error);
    }
  }

  return { genres, fetchAllGenres, addGenre, removeGenre }
})
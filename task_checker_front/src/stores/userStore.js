//生まれた 森

import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api/axios'

export const useUserStore = defineStore('user', () => {
  const users = ref([])
  const fetchAllUsers = async() =>{
    try {
    const response = await api.get('/users');
    users.value = response.data;
    }catch(error) {
      console.log("ユーザーデータの取得ができませんでした", error);
    }
  }

  return { users, fetchAllUsers }
})

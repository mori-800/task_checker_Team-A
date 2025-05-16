//生まれた 森

import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api/axios'

export const useUserStore = defineStore('user', () => {
  const users = ref([])

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users') // /users エンドポイントは別途作成する必要があります
      users.value = response.data
    } catch (error) {
      console.error('ユーザー一覧の取得に失敗しました:', error)
    }
  }

  return { users, fetchUsers }
})

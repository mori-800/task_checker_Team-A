<script setup>
import Header from './Header.vue'
import { ref } from 'vue'
import { auth, createUserWithEmailAndPassword,updateProfile } from '../firebase';//updateProfileを追加　森
import { useRouter } from 'vue-router';
import api from '../api/axios' // ✅ API呼び出し用axiosインスタンスをインポート

const email = ref('');
const password = ref('');
const nickname = ref(''); //ニックネーム登録機能追加用　森
const router = useRouter();

const handleSignUp = async () => {
  try {
    // Firebase Auth に登録
    const credentialUser = await createUserWithEmailAndPassword(auth, email.value, password.value)
    const user = credentialUser.user

    // Firebase に displayName を登録
    await updateProfile(user, {
      displayName: nickname.value
    })

    // ✅ バックエンドのDBにユーザー情報を保存
    await api.post('/users', {
      uid: user.uid,
      email: user.email,
      displayName: nickname.value,
      photoURL: user.photoURL || null,
    })

    router.push("/home")
  } catch (error) {
    console.log('ユーザー登録できませんでした', error)
  }
}
</script>

<template>
  <Header />
  <div class="form-body">
    <h1>新規登録</h1>
    <input type="text" id="email" v-model="email" placeholder="email">
    <input type="password" id="password" v-model="password" placeholder="password">
    <!-- ニックネーム登録機能追加用 森-->
    <input type="text" id="nickname" placeholder="nickname" v-model="nickname">
    <button value="新規登録" @click="handleSignUp">新規登録</button>
    <p>既にアカウントをお持ちの方はこちらへ<router-link to="/">こちら</router-link></p>
  </div>
</template>

<style scoped>
.form-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 50vh;
  padding: 2vw 10vw;
  text-align: center;
}

input {
  margin-bottom: 16px;
}

button {
  background-color: rgb(66, 163, 247);
  color: white;
  border-radius: 25px;
  border-style: none;
  padding: 8px 20px;
  margin-bottom: 8px;
  font-size: 15px;
  width: 246px;
}

</style>
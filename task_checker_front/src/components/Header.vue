<script setup>
import CheckAll from 'vue-material-design-icons/CheckAll.vue';
import { auth, signOut, onAuthStateChanged } from '../firebase';
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

const router = useRouter();
const currentUser = ref(null);
const searchKeyword = ref('');
const displayName = ref('')

const handleSignOut = async() => {
  try{
    await signOut(auth)
    router.push("/")
  }catch(error){
    console.log('ログアウトに失敗しました')
  }
}

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if(user) {
      currentUser.value = auth.currentUser;
      displayName.value=auth.currentUser.displayName;
    }else{
      currentUser.value = null;
    }
  })
})


const handleSubmit = (e) => {
  e.preventDefault();
  if (searchKeyword.value.trim()) {
    router.push({
      path: '/search',
      query: { q: searchKeyword.value }
    });
  }
};

const handleMypage = async() =>{
  try{
    router.push("/mypage")
  }catch{
    console.log('マイページの遷移に失敗しました')
  }
}
</script>

<template>
  <div class="header">
    <div class="header-top">
      <div class="header-left">
        <CheckAll class="header_icon" :size="25"/>
        <router-link to="/home" class="header_title">Task Checker</router-link>
      </div>

      <div class="header-search" v-if="currentUser" >
        <form class="search-container" @submit="handleSubmit">
          <input
            v-model="searchKeyword"
            placeholder="タイトルで検索"
            class="search-input"
            type="search"
            aria-label="検索"
          />
          <button type="submit" class="search-button">検索</button>
        </form>
      </div>
    </div>
    <div class="header-user" v-if="currentUser">
      <!-- ニックネームを表示する 森-->
      <div class="user-name">
        😊こんにちは！ {{ displayName }} さん
      </div>
        <div class="header-right">
        <!-- マイページへの遷移ボタンを追加 森 -->
        <button @click="handleMypage" class="mypage-button">マイページ</button>
        <button @click="handleSignOut" class="logout-button">ログアウト</button>
      </div>
    </div>
  </div>
</template>


<style scoped>
.header {
  /* height: 100px; ← これを削除 or コメントアウト */
  background: linear-gradient(to right, #fceaff, #e0f7ff);
  box-shadow: 0 4px 6px rgba(255, 182, 255, 0.3);
  border-bottom: 2px dashed #ffc8f9;
  overflow: hidden;
  font-family: 'Comic Sans MS', cursive, sans-serif;

  padding-bottom: 10px; /* 下に少し余白をつけておくとGood◎ */
}
.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1% 1% 0 1%;
}

.header-left {
  display: flex;
  align-items: center;
}

.header_icon {
  color: #ff99cc;
}

.header_title {
  color: #cc66ff;
  font-size: 28px;
  font-weight: bold;
  text-decoration: none;
  text-shadow: 1px 1px #fff0f5;
}

.search-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  max-width: 400px;
}

.search-input {
  flex: 1;
  padding: 0.5rem 0.7rem;
  background-color: #fff0fa;
  border: 2px dashed #ffccf9;
  border-radius: 12px;
  font-size: 0.9rem;
  color: #703c85;
  transition: all 0.3s ease;
  box-shadow: inset 0 1px 2px rgba(255, 182, 255, 0.3);
}

.search-button {
  padding: 0.5rem 1rem;
  background: linear-gradient(to right, #ffccf9, #ffebf9);
  color: #703c85;
  border: 2px solid #ffc8f9;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-button {
  background: linear-gradient(to right, #fcd5ce, #f9c0c0);
  color: #6d2932;
  border-radius: 12px;
  border: none;
  padding: 8px 20px;
  margin-left: 10px;
  font-weight: bold;
}

.mypage-button {
  background: linear-gradient(to right, #d0f0ff, #c7eaff);
  color: #2c2c72;
  border-radius: 12px;
  border: none;
  padding: 8px 20px;
  font-weight: bold;
  margin-right: 10px;
}

.header-user {
  display: flex;
  justify-content: space-between;
  margin: 5px 1% 5px 1%;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.5);
  border-top: 2px dotted #ffccf9;
  border-bottom: 2px dotted #ffccf9;
  padding: 5px 10px;
  border-radius: 10px;
}

.user-name {
  font-size: 16px;
  color: #9966cc;
  display: flex;
  align-items: center;
}
</style>

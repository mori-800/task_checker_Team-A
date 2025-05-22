<script setup>
import CheckAll from 'vue-material-design-icons/CheckAll.vue';
import { auth, signOut, onAuthStateChanged } from '../firebase';
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

const router = useRouter();
const currentUser = ref(null);
const searchKeyword = ref('');

const props = defineProps({
  displayName:String,
})


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
    <div class="header-user">
      <!-- ニックネームを表示する 森-->
      <div class="user-name">
        😊こんにちは！ {{ displayName }} さん
      </div>
        <div class="header-right">
        <button v-if="currentUser" @click="handleSignOut" class="logout-button">ログアウト</button>
        <!-- マイページへの遷移ボタンを追加 森 -->
        <button @click="handleMypage" class="mypage-button">マイページ</button>
      </div>
    </div>
  </div>
</template>


<style scoped>
.header {
  height: 100px;
  background-color: white;
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
.header-top{
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
  color: rgb(170, 1, 1);
}

.header_title {
  color: rgb(70, 70, 70);
  font-size: 25px;
  font-weight: bold;
  text-decoration: none;
}


.search-container {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  width: 100%;
  max-width: 400px;
}

.search-input {
  flex: 1;
  padding: 0.4rem 0.6rem;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.7rem;
  color: #1f2937;
  transition: all 0.2s ease;
}

.search-button {
  padding: 0.5rem 0.8rem;
  background-color: #4f83f2;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.logout-button {
  background-color: rgb(66, 163, 247);
  color: white;
  border-radius: 6px;
  border-style: none;
  padding: 8px 20px;
}

/* マイページへの遷移ボタン 森 */
.mypage-button {
  background-color: rgb(66, 163, 247);
  color: white;
  border-radius: 6px;
  border-style: none;
  padding: 8px 20px;
  text-decoration: none;
  margin-left: 10px;
}
.header-user {
 display: flex;
 justify-content:space-between;
 margin: 5px 1% 5px 1%;
}
.user-name{
  font-size: 15px;
  display: flex;
  text-align: center;
  align-items: center;
}
</style>

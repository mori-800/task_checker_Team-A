<script setup>
import { ref, onMounted } from 'vue';
import { useGenreStore } from '../../stores/genreStore';

const genre = ref({ name: '' });
const genreStore = useGenreStore();



// ジャンルのリストを格納するための変数 吉田
const genreList = ref([]);

// ジャンル名を全て取得する関数 吉田
const fetchGenres = async () => {
  try {
    await genreStore.fetchAllGenres();  // 全ジャンルの取得
    genreList.value = genreStore.genres;  // store から取得したジャンルを表示用変数にセット
  } catch (error) {
    console.log('ジャンルの取得に失敗しました', error);
  }
};

// ジャンルの追加処理 吉田
const submitGenre = async () => {
  try {
    await genreStore.addGenre(genre.value);

    // 入力フォームのリセット
    genre.value = { name: '' };

    // ジャンルの再取得
    await fetchGenres();  // 追加後に再度ジャンルリストを取得
  } catch (error) {
    console.log('ジャンルの保存に失敗しました', error);
  }
};

// ジャンルの削除処理　吉田
const removeGenre = async(removeId) => {
  try{
    await genreStore.removeGenre(removeId);
  }catch(error){
    console.log('ジャンルの削除に失敗しました', error);
  }
}

// モーダルが表示されるタイミングでジャンルを取得　吉田
onMounted(fetchGenres);
</script>


<template>
  <div class="modal_body">
      <h2 class="input_menu">ジャンル編集</h2>
      <ul>
        <li class="genre_title" v-for="genre in genreStore.genres" :key="genre.id">
          <span>{{ genre.name }}</span>
          <input class="delete_btn" type="submit" value="×" @click="removeGenre(genre.id)">
        </li>
      </ul>
      <form>
        <input class="input_genre" type="text" placeholder="ジャンル名" v-model="genre.name"/>
        <input class="input_submit" type="button" value="追加" @click="submitGenre" />
      </form>
  </div>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
}

.input_genre {
  padding: 8px;
  margin-bottom: 8px;
}

.input_submit {
  width: 160px;
  margin-left: auto;
}

.genre_list {
  margin-top: 20px;
}

.genre_list ul {
  list-style-type: none;
  padding: 0;
}

.genre_list li {
  padding: 5px 0;
  border-bottom: 1px solid #ddd;
}

.delete_btn {
  margin-left: 24px;
}
</style>

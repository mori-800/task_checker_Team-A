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
    await genreStore.fetchAllGenres();
    genreList.value = genreStore.genres;
  } catch (error) {
    console.log('ジャンルの取得に失敗しました', error);
  }
};

// ジャンルの追加処理 吉田
const submitGenre = async () => {
  try {
    await genreStore.addGenre(genre.value);
    genre.value = { name: '' };
    await fetchGenres();
  } catch (error) {
    console.log('ジャンルの保存に失敗しました', error);
  }
};

// ジャンルの削除処理 吉田
const removeGenre = async (removeId) => {
  try {
    await genreStore.removeGenre(removeId);
    await fetchGenres();
  } catch (error) {
    console.log('ジャンルの削除に失敗しました', error);
  }
};

// モーダルが表示されるタイミングでジャンルを取得 吉田
onMounted(fetchGenres);
</script>

<template>
  <div class="modal_body">
  <h2 class="input_title">ジャンル編集</h2>

    <ul class="genre_list">
      <li class="genre_item" v-for="genre in genreStore.genres" :key="genre.id">
        <span class="genre_name">{{ genre.name }}</span>
        <input class="delete_btn" type="submit" value="×" @click="removeGenre(genre.id)" />
      </li>
    </ul>

    <form class="add-genre-form">
      <input class="input_genre" type="text" placeholder="ジャンル名" v-model="genre.name" />
      <input class="input_submit" type="button" value="追加" @click="submitGenre" />
    </form>
  </div>
</template>

<style scoped>
/* ジャンル編集の文字 */
.input_title {
  font-size: 26px;
  font-weight: bold;
  color: #fff;
  text-align: center;
  margin-bottom: 20px;
  font-family: 'Kiwi Maru', 'Comic Sans MS', cursive;
  padding: 10px 20px;
  background: linear-gradient(90deg, #ffaaff, #ffccf9, #d5bfff);
  border-radius: 12px;
  box-shadow:
    0 0 10px #ffccf9,
    0 0 20px #ffc5ec,
    0 0 30px rgba(255, 192, 203, 0.4);
  display: inline-block;
}


/* ジャンル追加フォームのタイトルも */
.add-genre-form {
  display: flex;
  align-items: center;
  margin-top: 16px;
  background-color: #fff0fa;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(255, 182, 255, 0.2);
}

.input_genre {
  padding: 10px;
  margin-right: 10px;
  flex-grow: 1;
  border: 2px dashed #ffccf9;
  border-radius: 10px;
  background-color: #fdf5ff;
  font-family: 'Comic Sans MS', cursive;
  color: #703c85;
}

.input_submit {
  width: 100px;
  padding: 10px;
  background: linear-gradient(to right, #ffccf9, #ffebf9);
  color: #703c85;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  box-shadow: 0 3px 6px rgba(255, 182, 255, 0.3);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.input_submit:hover {
  transform: scale(1.05);
}

/* ジャンルリスト */
.genre_list {
  margin-top: 20px;
  list-style-type: none;
  padding: 0;
}

.genre_item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  margin-bottom: 10px;
  background: #fceaff;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(255, 182, 255, 0.2);
}

.genre_name {
  font-size: 16px;
  margin-right: 12px;
  flex-shrink: 1;
  color: #703c85;
  font-family: 'Comic Sans MS', cursive;
}

/* 削除ボタン */
.delete_btn {
  width: 28px;
  height: 28px;
  font-size: 16px;
  background-color: #ff99aa;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  text-align: center;
  line-height: 28px;
  padding: 0;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(255, 182, 193, 0.4);
  transition: transform 0.2s ease;
}

.delete_btn:hover {
  transform: rotate(10deg) scale(1.1);
}
</style>



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
    <h2 class="input_menu">ジャンル編集</h2>

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
/* ジャンル追加フォーム（横並び） */
.add-genre-form {
  display: flex;
  align-items: center;
  margin-top: 16px;
}

.input_genre {
  padding: 8px;
  margin-right: 8px;
  flex-grow: 1;
}

.input_submit {
  width: 100px;
  padding: 8px;
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
  padding: 6px 0;
  border-bottom: 1px solid #ddd;
}

.genre_name {
  font-size: 16px;
  margin-right: 12px; /* ← この行を追加 */
  flex-shrink: 1;
}

.delete_btn {
  width: 24px;
  height: 24px;
  font-size: 14px;
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  line-height: 20px;
  padding: 0;
  flex-shrink: 0;
}

</style>

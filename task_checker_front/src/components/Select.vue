<script setup>
import { useGenreStore } from '../stores/genreStore';

const genreStore = useGenreStore();

</script>

<template>
  <select class="select">
    <option value="">---</option>
    <option v-for="genre in genreStore.genres" :key="genre.id" :value=genre.id>{{ genre.name }}</option>
  </select>
</template>

<style scoped>
.select {
  width: 150px;
  height: 35px;
  font-size: 16px;
  color: #852ca8;
  background-color: #fdf5ff; /* 明るいピンクの背景 */
  border: none;
  border-radius: 12px; /* 丸みを持たせた角 */
  border-bottom: 2px solid #ffccf9; /* ピンクのボーダー */
  outline: none;
  padding: 8px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(255, 182, 255, 0.3); /* 柔らかい影 */
  transition: transform 0.2s ease;
}



</style>
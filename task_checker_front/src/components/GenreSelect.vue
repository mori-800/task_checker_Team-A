<script setup>
import { useGenreStore } from '../stores/genreStore';
import { Form, Field, defineRule, ErrorMessage } from 'vee-validate';
import { required, email, min, confirmed } from '@vee-validate/rules';

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('confirmed', confirmed);

const genreStore = useGenreStore();

</script>

<template>
  <Field name="genreId" rules="required" v-slot="{ field, ErrorMessage }">
    <select v-bind="field" class="select">
      <option disabled value="">---</option>
      <option v-for="genre in genreStore.genres" :key="genre.id" :value="genre.id">
        {{ genre.name }}
      </option>
    </select>
    
    <ErrorMessage as="div" name="genreId">
      <p>This field must be selected</p>
    </ErrorMessage> 
  </Field>
</template>

<style scoped>
.select {
  width: 150px;
  height: 35px;
  font-size: 16px;
  color: #703c85;
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
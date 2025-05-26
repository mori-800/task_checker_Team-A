<script setup>
import { useGenreStore } from '../stores/genreStore';
import { Field, defineRule, ErrorMessage } from 'vee-validate';
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
    
    <ErrorMessage as="div" name="genreId" class="error-message">
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
  background-color: #fdf5ff;
  border: none;
  border-radius: 12px; 
  border-bottom: 2px solid #ffccf9; 
  outline: none;
  padding: 8px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(255, 182, 255, 0.3); 
  transition: transform 0.2s ease;
}

/* エラーメッセージ */
.error-message {
  color: #f76262;
  font-size: 0.8rem;
  margin-top: 2px; /* 少し余白を減らして、ギュッと */
  font-family: 'Comic Sans MS', cursive;
}
</style>
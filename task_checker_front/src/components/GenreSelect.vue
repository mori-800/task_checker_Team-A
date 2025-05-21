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
<!-- <Field name="genreId" rules="required" v-slot="{ field, ErrorMessage }">
  <select v-bind="field" class="select">
    <option disabled value="">---</option>
    <option v-for="genre in genreStore.genres" :key="genre.id" :value="genre.id">
      {{ genre.name }}
    </option>
  </select>
  <ErrorMessage as="div" name="genreId">
    <p>This field must be selected</p>
  </ErrorMessage> 
</Field>-->

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
  height: 25px;
  font-size: 15px;
  color: rgb(70, 70, 70);
  border: none;
  border-bottom: thin solid #cfcfcf;
  outline: none;
  cursor: pointer;
}
</style>
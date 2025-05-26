<script setup>
import { computed } from 'vue'
import GenreBody from './FormModalBody/GenreBody.vue'
import TaskBody from './FormModalBody/TaskBody.vue'
import DetailBody from './FormModalBody/DetailBody.vue'
import EditBody from './FormModalBody/EditBody.vue'

const props = defineProps({
  body: String,
  task: Object
})

const component = computed(() => {
  if (props.body === 'taskBody') return TaskBody;
  else if (props.body === 'genreBody') return GenreBody;
  else if (props.body === 'detailBody') return DetailBody;
  else if (props.body === 'editBody') return EditBody;
});

const emit = defineEmits('close-modal') 

const closeModal = () => {
  emit('close-modal')
}

</script>

<template>
  <Modal v-model="showModal">
    <component :is="component" @close-modal="closeModal" :task="task"/>
  </Modal>
</template>

<style>
.vm {
  height: 80vh;
  padding: 4vh 8vw;
  text-align: center;
  background-color: #f2f5f9eb; /* パステルピンク */
  border-radius: 20px; /* 丸みを持たせた角 */
  box-shadow: 0 5px 15px rgba(197, 237, 249, 0.3); /* やわらかい影 */
  overflow-y: auto;
}

</style>
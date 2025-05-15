<script setup>
import { computed } from 'vue'
import GenreBody from './GenreBody.vue'
import TaskBody from './TaskBody.vue'
import DetailBody from './DetailBody.vue'
import EditBody from './EditBody.vue'

const props = defineProps({
  body: String,
  task: Object
})

//送られてきたbodyの名前によってフォームモーダルを切り替える
const component = computed(() => {
  if (props.body === 'taskBody') return TaskBody;
  else if (props.body === 'genreBody') return GenreBody;
  else if (props.body === 'detailBody') return DetailBody;
  else if (props.body === 'editBody') return EditBody;
});

//開かれた場所に対して閉じるemitを送る
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
  height: 75vh;
  padding: 2vw 10vw;
  text-align: center;
  overflow-y: auto;
}
</style>
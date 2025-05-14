<script setup>
import { ref , computed} from 'vue'

//Taskから{task}を取得する
const props = defineProps({
  task: Object
})
const emit = defineEmits('close-modal');
const editModal=ref(false);

const closeModal = () => {
  showModal.value = false
}

//{task}の中身へ親要素からもらった{task}を代入
const task = ref({
  name: props.task.title,
  explanation: props.task.explanation,
  deadlineDate: props.task.deadlineDate,
})

console.log(props.task)
const formattedDeadlineDate = computed(() => {
  const date = new Date(props.task.deadlineDate)
  return date.toLocaleDateString('ja-JP')
})

</script>

<template>
  <form class="modal_body">
    <div class="detail_modal_body">
      <div class="detail_modal_content">
        <h2 class="detail_modal_title">タイトル</h2>
        <div class="detail_task_title">{{ task.name }}</div>
        <h2 class="detail_modal_title">説明</h2>
        <div class="detail_task_title">{{ task.explanation }}</div>
        <h2 class="detail_modal_title">期限</h2>
        <div class="detail_task_title">{{ formattedDeadlineDate }}</div>
      </div>
      <button class="detail_edit_button" @click="showModal=true">
        編集
      </button>
      <button class="detail_delete_button">削除</button>
    </div>
  </form>
</template>

<style scoped>

.detail_modal_body{
  display: flex;
  align-items:flex-start;
  justify-content: center;
  text-align: left;
}
.detail_modal_content{
  width: 250px;
}
.detail_edit_button{
  background-color: rgb(66, 163, 247);
  color: white;
  border-radius: 25px;
  border-style: none;
  padding: 8px 20px;
  margin-bottom: 8px;
  font-size: 15px;
  margin: 15px 10px 15px 30px;
}
.detail_delete_button{
  background-color: rgb(66, 163, 247);
  color: white;
  border-radius: 25px;
  border-style: none;
  padding: 8px 20px;
  margin-bottom: 8px;
  font-size: 15px;
  margin: 15px 10px;
}
</style>
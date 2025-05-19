<script setup>
import { ref , computed} from 'vue'
import FormModal from '../FormModal.vue';
import { useTaskStore } from '../../stores/taskStore';
import { useUserStore } from '../../stores/userStore'

const taskStore=useTaskStore();
const showModal=ref(false)
//Taskから{task}を取得する
const props = defineProps({
  task: Object
})

const userStore = useUserStore()

const assigneeName = computed(() => {
  const user = userStore.users.find(u => u.uid === props.task.assigneeId)
  return user ? user.displayName || '（名前未登録）' : '不明なユーザー'
})

//{task}の中身へ親要素からもらった{task}を代入
const task = ref({
  name: props.task.name,
  explanation: props.task.explanation,
  deadlineDate: props.task.deadlineDate,
})

//時間をjpの表示に変更
const formattedDeadlineDate = computed(() => {
  const date = new Date(props.task.deadlineDate)
  return date.toLocaleDateString('ja-JP')
})

//編集モーダルを閉じる river
const closeModal = () => {
  showModal.value = false
}

//閉じるボタンを押されたらモーダルを閉じる river
const emit = defineEmits('close-modal');

const DeleteTask =(async(taskId)=> {
  try{
    await taskStore.deleteTasks(taskId)
    emit('close-modal')
  }catch(error){
    console.error(error);
  }
});


</script>

<template>
  <form class="modal_body">
    <div class="detail_modal_body">
      <div class="detail_modal_content">
        <h2 class="detail_modal_title">タイトル</h2>
        <div class="detail_task_title">{{ task.name }}</div>
        <h2 class="detail_modal_explanation">説明</h2>
        <div class="detail_task_explanation">{{ task.explanation }}</div>
        <h2 class="detail_modal_deadlineDate">期限</h2>
        <div class="detail_task_deadlineDate">{{ formattedDeadlineDate }}</div>
            <p class="assignee">担当者: {{ assigneeName }}</p>

      </div>
      <button type="button" class="detail_edit_button" @click="showModal=true">
          編集
        <FormModal v-model="showModal" body="editBody" :task="props.task" @close-modal="closeModal" />
      </button>
      <button type="button" class="detail_delete_button" @click="DeleteTask(props.task.id)">削除</button>
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
  background-color: rgb(233, 77, 77);
  color: white;
  border-radius: 25px;
  border-style: none;
  padding: 8px 20px;
  margin-bottom: 8px;
  font-size: 15px;
  margin: 15px 10px;
}
.detail_close_button{
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
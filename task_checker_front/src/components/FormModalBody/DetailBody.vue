<script setup>
import { ref , computed , onMounted} from 'vue';
import FormModal from '../FormModal.vue';
import { useTaskStore } from '../../stores/taskStore';
import { useUserStore } from '../../stores/userStore';
import { useCommentStore } from '../../stores/comment';
import Comment from '../Comment.vue';

const commentStore = useCommentStore();
const taskStore=useTaskStore();
const showModal=ref(false)
//Taskから{task}を取得する
const props = defineProps({
  task: Object
})

const userStore = useUserStore()
const comment = ref({});

const assigneeName = computed(() => {
  const user = userStore.users.find(u => u.uid === props.task.assigneeId)
  return user ? user.displayName || '（名前未登録）' : '不明なユーザー'
})

const filterComment = (taskId) => {
  //全コメントデータの中からchatIdが合致するものだけを取得する
  return commentStore.comments.filter(comment => comment.taskId == taskId)
}

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

const submitComment = async(taskId) => {
  comment.value.taskId = taskId
  try{
    await commentStore.addComment(comment.value);
    comment.value = {content: '', taskId: ''}
  }catch(error){
    console.log('コメントの保存に失敗しました');
  }
}

onMounted(async()=> {
  await commentStore.fetchComment();
})
</script>

<template>
  <div class="detail_modal_body">
    <div class="detail_modal_header">
      <h2 class="detail_modal_title">タイトル</h2>
      <div class="buttons">
        <button type="button" class="detail_edit_button" @click="showModal=true">
          編集
          <FormModal v-model="showModal" body="editBody" :task="props.task" @close-modal="closeModal" />
        </button>
        <button type="button" class="detail_delete_button" @click="DeleteTask(task.id)">削除</button>
      </div>
    </div>
    <div class="detail_modal_center">
      <div class="detail_task_title">{{ task.name }}</div>
      <h2 class="detail_modal_explanation">説明</h2>
      <div class="detail_task_explanation">{{ task.explanation }}</div>
      <div class="detail_modal_center-bottom">
        <h2 class="detail_modal_deadlineDate">期限</h2>
        <div class="detail_modal_DateAndAssignee">
          <div class="detail_task_deadlineDate">{{ formattedDeadlineDate }}</div>
          <div class="detail_task_assignee">担当者: {{ assigneeName }}</div>
        </div>
      </div>
      
    </div>
  </div>
  <form class="comment-from">
    <h2><label for="comment">コメント投稿</label></h2>
    <textarea v-model="comment.content" id="comment" placeholder="コメントを入力してください"></textarea>
    <div>
      <button @click.prevent="submitComment(task.id)" class="comment-submit-button">送信</button>
    </div>
  </form>

  <h2 class="comment-title">コメント一覧</h2>
  <div v-for="comment in filterComment(task.id)" :key="comment.id">
    <Comment :comment="comment"/>
  </div>

</template>

<style scoped>
h2 {
  margin: 20px 0 10px 0;
  color: #cc66ff;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  text-shadow: 1px 1px #ffe6fa;
}

.detail_modal_body {
  align-items: flex-start;
  text-align: left;
  margin-bottom: 30px;
  background-color: #fff0fa;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 4px 8px rgba(255, 182, 255, 0.2);
}

.detail_modal_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.detail_edit_button {
  background: linear-gradient(to right, #d0f0ff, #c7eaff);
  color: #2c2c72;
  border-radius: 12px;
  border-style: none;
  padding: 8px 20px;
  text-decoration: none;
  margin-left: 10px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(180, 220, 255, 0.5);
  transition: all 0.2s ease;
}

.detail_delete_button {
  background: linear-gradient(to right, #fcd5ce, #f9c0c0);
  color: #6d2932;
  border-radius: 12px;
  border-style: none;
  padding: 8px 20px;
  text-decoration: none;
  margin-left: 10px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(255, 160, 160, 0.4);
  transition: all 0.2s ease;
}

.detail_task_title {
  font-size: 22px;
  color: #9966cc;
  font-weight: bold;
  font-family: 'Comic Sans MS', cursive, sans-serif;
}

.detail_modal_DateAndAssignee {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #999;
}

.detail_task_assignee {
  color: #9999cc;
  font-style: italic;
}

.comment-from {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-top: 2px dotted #ffc8f9;
  margin-top: 20px;
  padding-top: 15px;
}

#comment {
  width: 95%;
  background-color: #fdf0ff;
  border: 2px dashed #ffccf9;
  border-radius: 10px;
  padding: 8px;
  font-family: 'Comic Sans MS', cursive;
  color: #703c85;
}

.comment-submit-button {
  background: linear-gradient(to right, #ffccf9, #ffebf9);
  color: #703c85;
  border-radius: 12px;
  border-style: none;
  padding: 8px 20px;
  text-decoration: none;
  margin: 10px 10px;
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(255, 182, 255, 0.3);
}

.comment-title {
  border-top: 2px dotted #ffc8f9;
  font-size: 1rem;
  color: #cc66ff;
  margin-top: 15px;
  padding-top: 10px;
  font-family: 'Comic Sans MS', cursive;
}
</style>

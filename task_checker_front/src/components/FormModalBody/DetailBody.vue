<script setup>
import { ref , computed , onMounted } from 'vue';
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
h2{
  margin: 20px 0 10px 0;
}
.detail_modal_body{
  align-items:flex-start;
  text-align: left;
  margin-bottom: 30px;
}
.detail_modal_header{
  display: flex;
  justify-content: space-between;
}
.detail_edit_button{
  background-color: rgb(66, 163, 247);
  color: white;
  border-radius: 6px;
  border-style: none;
  padding: 8px 20px;
  text-decoration: none;
  margin-left: 10px;
}
.detail_delete_button{
  background-color: rgb(233, 77, 77);
  color: white;
  border-radius: 6px;
  border-style: none;
  padding: 8px 20px;
  text-decoration: none;
  margin-left: 10px;
}
.detail_task_title{
  font-size: 20px;
}
.detail_modal_DateAndAssignee{
  display: flex;
  justify-content: space-between;
}
.detail_task_assignee{
  color: slategray
}
.comment-from{
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-top: 1px solid slategray;
}
#comment{
  width: 95%;
}
.comment-submit-button{
  background-color: rgb(66, 163, 247);
  color: white;
  border-radius: 6px;
  border-style: none;
  padding: 8px 20px;
  text-decoration: none;
  margin: 10px 10px;
}
.comment-title{
  border-top: 1px solid slategray;
}
</style>
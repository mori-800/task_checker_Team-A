<script setup>
import { useCommentStore } from '../stores/comment';

const props = defineProps({
  comment: Object
})
const commentStore = useCommentStore();

const deleteComment = async(commentId) => {
  try{
    await commentStore.removeComment(commentId);
  }catch(error){
    console.log("コメントの削除に失敗しました")
  }
}
</script>

<template>
  <div class="comment_wrapper">
    <p class="comment_content">{{ comment.content }}</p>
    <button @click="deleteComment(comment.id)" class="btn">×</button>
  </div>
</template>

<style scoped>
.comment_wrapper{
  display: flex;
  /* justify-content: center; */
  align-items: center;
  margin-bottom: 8px;
}

.comment_content {
  margin: 8px 0;
  width: 100%;
  font-size: 15px;
}

.btn {
  background-color: rgb(233, 77, 77);
  color: white;
  width: 40px;
  border-radius: 6px;
  border-style: none;
  padding: 8px 15px;
  margin-bottom: 8px;
  font-size: 15px;
  margin: 15px 10px;
  text-align: center;
}
</style>

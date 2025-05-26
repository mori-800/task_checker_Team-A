<script setup>
import { useCommentStore } from '../stores/comment';
import { useUserStore } from '../stores/userStore';
import { computed } from 'vue';

const props = defineProps({
  comment: Object
})
const commentStore = useCommentStore();
const userStore = useUserStore();

const MakerName = computed(() => {
  const user = userStore.users.find(u => u.uid === props.comment.makerId)
  return user ? user.displayName || '（名前未登録）' : '不明なユーザー'
})

//JP時間に変更する関数
function toJPDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
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
    <p class="comment_content">{{ MakerName }}</p>
    <p class="comment_content">{{ comment.content }}</p>
    <p class="comment_content">{{ comment.content_dt }}</p>
    <button @click="deleteComment(comment.id)" class="btn">×</button>
  </div>
</template>

<style scoped>
.comment_wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  background: #fff0fa;
  border-radius: 12px;
  padding: 10px;
  box-shadow: 0 2px 6px rgba(255, 182, 255, 0.2);
}

.comment_content {
  margin: 8px 0;
  width: 100%;
  font-size: 15px;
  color: #703c85;
  font-family: 'Comic Sans MS', cursive;
  background-color: #fdf5ff;
  padding: 10px;
  border-radius: 10px;
  border: 1px dashed #ffccf9;
  box-shadow: inset 0 1px 2px rgba(255, 182, 255, 0.2);
}

.btn {
  background: linear-gradient(to right, #fcd5ce, #f9c0c0);
  color: #6d2932;
  width: auto;
  border-radius: 12px;
  border: none;
  padding: 8px 20px;
  margin: 15px 10px;
  font-size: 15px;
  font-weight: bold;
  text-align: center;
  box-shadow: 0 2px 4px rgba(255, 182, 193, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:hover {
  transform: scale(1.05);
  background: linear-gradient(to right, #f9c0c0, #fcd5ce);
}
</style>


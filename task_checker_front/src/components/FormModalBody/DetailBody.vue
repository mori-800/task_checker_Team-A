<script setup>
import { ref , computed , onMounted } from 'vue';
import FormModal from '../FormModal.vue';
import { useTaskStore } from '../../stores/taskStore';
import { useGenreStore } from '../../stores/genreStore'
import { useUserStore } from '../../stores/userStore';
import { useCommentStore } from '../../stores/comment';
import Comment from '../Comment.vue';

import { Form, Field, ErrorMessage } from 'vee-validate'
import { required } from '@vee-validate/rules'
import { defineRule } from 'vee-validate'

defineRule('required', required)

// コメント送信ボタンが押されたときに呼ばれる
const handleSubmitComment = (values) => {
  submitComment(props.task.id, values)
}

// コメントをstoreに送信し、再取得して一覧に反映
const submitComment = async (taskId, values) => {
  console.log('コメント送信:', values.content, 'taskId:', taskId)
  await commentStore.addComment({
    taskId,
    content: values.content
  })
  await commentStore.fetchComment()  // 再取得して反映
}

const commentStore = useCommentStore();
const taskStore=useTaskStore();
const genreStore = useGenreStore()
const userStore = useUserStore()

const showModal=ref(false)
//Taskから{task}を取得する
const props = defineProps({
  task: Object
})

const comment = ref({});

// 担当者の名前をユーザー一覧から取得する
const assigneeName = computed(() => {
  const user = userStore.users.find(u => u.uid === props.task.assigneeId)
  return user ? user.displayName || '（名前未登録）' : '不明なユーザー'
})

// ✅ 追加：作成者の名前をユーザー一覧から取得する
const makerName = computed(() => {
  const user = userStore.users.find(u => u.uid === props.task.makerId)
  return user ? user.displayName || '（名前未登録）' : '不明なユーザー'
})

// 全コメントデータの中から taskId が合致するものだけを取得する
const filterComment = (taskId) => {
  return commentStore.comments.filter(comment => comment.taskId == taskId)
}

// 時間を日本語表示に変換
const formattedDeadlineDate = computed(() => {
  if (!props.task || !props.task.deadlineDate) return ''

  const deadline = new Date(props.task.deadlineDate)

  /* ---------------------------------------------
     「完了」ボタンを押すと＋1000 年で保存される設計なので、
     500 年より後（≒未来日付として明らかにおかしい） を
     「完了」とみなし、表示上は ‐1000 年して元の期限日に戻す。
  ----------------------------------------------*/
  const farFutureBorder = new Date()
  farFutureBorder.setFullYear(farFutureBorder.getFullYear() + 500)

  // 500 年後より未来 ＝ 完了扱い
  if (deadline > farFutureBorder) {
    const display = new Date(deadline)
    display.setFullYear(display.getFullYear() - 1000)
    return display.toLocaleDateString('ja-JP')
  }
  return deadline.toLocaleDateString('ja-JP')
})

// 編集モーダルを閉じる
const closeModal = () => {
  showModal.value = false
}

// 閉じるボタンを押されたらモーダルを閉じる
const emit = defineEmits('close-modal');

// タスクを削除する処理
const DeleteTask = async (taskId) => {
  try {
    await taskStore.deleteTasks(taskId)
    emit('close-modal')
  } catch (error) {
    console.error(error);
  }
}

// 初回マウント時にコメントとジャンル、ユーザー情報を取得
onMounted(async()=> {
  await commentStore.fetchComment();
  await genreStore.fetchAllGenres()
  await userStore.fetchAllUsers() // ✅ 担当者・作成者名の取得に必要
})

// ジャンルIDから名前を取得する
const genreName = computed(() => {
  const genre = genreStore.genres.find(g => g.id === props.task.genreId)
  return genre ? genre.name : 'ジャンル未設定'
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
        <div class="detail_modal_DeadAndGenre">
          <h2 class="detail_modal_deadlineDate">期限</h2>
          <!-- 期限はそのままに -->
          <div class="detail_task_deadlineDate">{{ formattedDeadlineDate }}</div>
        </div>
        <div class="detail_modal_genre_assignee_maker">
          <!-- ジャンル、担当者、作成者を右寄せで縦に並べる -->
          <div class="detail_task_genre">ジャンル: {{ genreName }}</div>
          <div class="detail_task_assignee">担当者: {{ assigneeName }}</div>
          <div class="detail_task_maker">作成者: {{ makerName }}</div>
        </div>
      </div>
    </div>
  </div>

  <Form @submit="handleSubmitComment" class="comment-form">
    <h2><label for="comment">コメント投稿</label></h2>

    <Field
      as="textarea"
      id="comment"
      name="content"
      placeholder="コメントを入力してください"
      rules="required"
      class="input-field"
    />
    <ErrorMessage name="content" v-slot="{ message }">
      <p class="error-message">何も書いてないと送信できないよ😿</p>
    </ErrorMessage>

    <button type="submit" class="comment-submit-button">送信</button>
  </Form>

  <h2 class="comment-title">コメント一覧</h2>
  <div v-for="comment in filterComment(task.id)" :key="comment.id">
    <Comment :comment="comment" />
  </div>
</template>

<style scoped>
.detail_task_maker {
  margin-top: 4px;
  color: #444;
  font-size: 14px;
}

/* ジャンル・担当者・作成者を縦に並べて右寄せ */
.detail_modal_genre_assignee_maker {
  display: flex;
  flex-direction: column; /* 縦並び */
  align-items: flex-end; /* 右寄せ */
  gap: 6px;
  margin-top: 10px;
}

.detail_task_genre,
.detail_task_assignee,
.detail_task_maker {
  color: #666699;
  font-style: italic;
  font-family: 'Comic Sans MS', cursive;
  font-size: 0.9rem;
  text-shadow: 1px 1px 2px #dde6fa;
}
</style>

<style scoped>
h2 {
  margin: 20px 0 10px 0;
  color: #cc66ff;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  text-shadow: 2px 2px 4px #ffd6fa, 0 0 6px #ffe6fb;
}

/* モーダル全体 */
.detail_modal_body {
  align-items: flex-start;
  text-align: left;
  margin-bottom: 30px;
  background: linear-gradient(145deg, #fff0fa, #fdf0ff);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 6px 20px rgba(255, 182, 255, 0.3);
  border: 2px dashed #ffc8f9;
}

/* ヘッダー部分（タスク名 + ボタン） */
.detail_modal_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 編集ボタン */
.detail_edit_button {
  background: linear-gradient(to right, #d0f0ff, #c7eaff);
  color: #2c2c72;
  border-radius: 14px;
  border: none;
  padding: 10px 24px;
  font-weight: bold;
  font-family: 'Comic Sans MS', cursive;
  box-shadow: 0 4px 10px rgba(180, 220, 255, 0.4);
  transition: all 0.2s ease;
  cursor: pointer;
}

.detail_edit_button:hover {
  transform: scale(1.05);
}

/* 削除ボタン */
.detail_delete_button {
  background: linear-gradient(to right, #fcd5ce, #f9c0c0);
  color: #6d2932;
  border-radius: 14px;
  border: none;
  padding: 10px 24px;
  margin-left: 3px;
  font-weight: bold;
  font-family: 'Comic Sans MS', cursive;
  box-shadow: 0 4px 10px rgba(255, 160, 160, 0.4);
  transition: all 0.2s ease;
  cursor: pointer;
}

.detail_delete_button:hover {
  transform: scale(1.05);
}

/* タスクタイトル */
.detail_task_title {
  font-size: 24px;
  color: #9966cc;
  font-weight: bold;
  font-family: 'Comic Sans MS', cursive;
  text-shadow: 1px 1px 2px #ffd6fa;
}

/* 「期限」と期限日付はそのまま */
.detail_modal_DeadAndGenre {
  justify-content: space-between;
  align-items: center;
}

/* コメントフォーム全体 */
.comment-from {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-top: 2px dotted #ffc8f9;
  margin-top: 30px;
  padding-top: 20px;
}

/* コメント入力欄 */
#comment {
  width: 95%;
  background-color: #fdf0ff;
  border: 2px dashed #ffccf9;
  border-radius: 12px;
  padding: 10px;
  font-family: 'Comic Sans MS', cursive;
  color: #703c85;
  box-shadow: 0 4px 8px rgba(255, 182, 255, 0.2);
}

/* コメント送信ボタン */
.comment-submit-button {
  background: linear-gradient(to right, #ffccf9, #ffebf9);
  color: #703c85;
  border-radius: 14px;
  border: none;
  padding: 10px 24px;
  font-weight: bold;
  font-family: 'Comic Sans MS', cursive;
  box-shadow: 0 4px 10px rgba(255, 182, 255, 0.3);
  margin-top: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.comment-submit-button:hover {
  transform: scale(1.05);
  background: linear-gradient(to right, #ffb7eb, #ffe3f4);
}

/* コメントタイトル */
.comment-title {
  border-top: 2px dotted #ffc8f9;
  font-size: 1.1rem;
  color: #cc66ff;
  margin-top: 15px;
  padding-top: 12px;
  font-family: 'Comic Sans MS', cursive;
  text-shadow: 1px 1px 2px #ffe6fa;
}
</style>


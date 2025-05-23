<script setup>
import Select from '../GenreSelect.vue'
import { ref,onMounted } from 'vue'
import { useTaskStore } from '../../stores/taskStore';
//ログインユーザー名をトップページに反映する 森
import  api from '../../api/axios';

import {Form, Field, defineRule, ErrorMessage } from 'vee-validate'; 
import { required, email, min, confirmed } from '@vee-validate/rules';

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('confirmed', confirmed);

//ユーザーリストを定義
const allUsers = ref([]);
const task = ref({
  name: '',
  explanation: '',
  deadlineDate: '',
  status: 0,
  genreId: null,
  assigneeId: '',
})

const taskStore = useTaskStore();
const emit = defineEmits(['close-modal'])

const genreSelect = (e) => {
  task.value.genreId = Number(e.target.value)
}
//ユーザーリストのプルダウン
onMounted(async () => {
  try {
    const fetchAllUsers = await api.get('/users')
    allUsers.value = fetchAllUsers.data
  } catch (error) {
    console.error("ユーザーデータの取得ができませんでした", error)
  }
})

const submitTask = async (values) => {
  try {
    // values にフォームのすべての入力値が入っている！
    const taskData = {
      ...task.value,
      ...values // name, explanation, deadlineDate, assigneeId を上書き
    }
    await taskStore.addTask(taskData)
    emit('close-modal')
  } catch (error) {
    console.error("タスクの登録に失敗しました", error)
  }
}

</script>

<template>
  <Form class="modal_body" @submit="submitTask">
    <h2 class="input_menu">タスクを追加</h2>
    <div>
      <h4 class="input_title">ジャンル</h4>
      <div class="task_genre">
        <Select @change="genreSelect" :value="task.genreId"/>
      </div>
      
      <!-- タイトル -->
      <h4 class="input_title">タイトル</h4>
      <Field type="text" id="name" class="input-field" name="name" rules="required" />
      <ErrorMessage as="div" name="name">
        <p>This field is required</p>
      </ErrorMessage>

            
      <!-- 説明 -->
      <h4 class="input_title">説明</h4>
      <Field type="text" id="explanation" class="input-field" name="explanation" rules="required" />
      <ErrorMessage as="div" name="explanation">
        <p>This field is required</p>
      </ErrorMessage>


      <!-- 期限 -->
      <h4 class="input_title">期限</h4>
      <Field type="date" id="deadlineDate" class="input-field" name="deadlineDate" rules="required" />
      <ErrorMessage as="div" name="deadlineDate">
        <p>This field is required</p>
      </ErrorMessage>
      

      <!-- 担当者 -->
      <h4 class="input_title">担当者</h4>
      <Field name="assigneeId" rules="required" v-slot="{ field }">
        <select v-bind="field" class="select">
          <option disabled value="">-- 担当者を選択 --</option>
          <option v-for="user in allUsers" :key="user.uid" :value="user.uid">
            {{ user.displayName || '名前未登録' }}
          </option>
        </select>
        <ErrorMessage as="div" name="assigneeId">
          <p>This field must be selected</p>
        </ErrorMessage>
      </Field>
    </div>    
    <input class="input_submit" type="submit" value="送信"/>
  </Form>
</template>

<style scoped>
/* モーダルボディ */
.input_menu {
  font-size: 20px;
  font-weight: bold;
  color: #bd7bab;
  text-align: center;
  margin-bottom: 24px;
  font-family: 'Comic Sans MS', 'Hiragino Maru Gothic Pro', 'Yu Gothic UI', sans-serif;
  padding: 10px 20px;
  background: linear-gradient(145deg, #fceaff, #e0f7ff);
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(200, 180, 255, 0.3);
  display: inline-block;
}

.modal_body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fdf2fb;
  border-radius: 16px;
  padding: 16px;  /* パディングを縮小 */
  box-shadow: 0 6px 16px rgba(255, 182, 255, 0.3);
  max-width: 70vw;
  max-height: 70vh;
  overflow-y: auto;
}

/* 各入力欄のタイトル */
.input_title {
  font-size: 14px;
  color: #ff7f9d;
  font-family: 'Dancing Script', cursive;
  margin-bottom: 6px; /* 上下余白を縮小 */
  text-shadow: 1px 1px 2px #ffccf9;
  font-weight: bold;
}

/* 入力フィールド */
input,
textarea {
  border: none;
  background-color: #f9f9f9;
  padding: 8px;  /* 少し小さめに */
  border-radius: 8px;
  width: 200px;
  line-height: 1.4em;
  font-size: 12px;
  font-family: 'Dancing Script', cursive;
  color: #6a3f7e;
  box-shadow: 0 4px 8px rgba(255, 182, 255, 0.3);
  margin-bottom: 8px; /* 上下の余白をさらに縮小 */
}

/* 選択式フィールド */
.select {
  width: 200px;
  padding: 8px;
  font-size: 12px;
  border-radius: 8px;
  background-color: #f9f9f9;
  color: #6a3f7e;
  box-shadow: 0 4px 8px rgba(255, 182, 255, 0.3);
  margin-bottom: 8px; /* 上下の余白を縮小 */
  border: none;
}

/* エラーメッセージ */
.error-message {
  color: #f76262;
  font-size: 0.8rem;
  margin-top: 2px; /* 少し余白を減らして、ギュッと */
}

/* 送信ボタン */
.input_submit {
  margin-top: 20px;
  background-color: #ff82c3;
  color: rgb(97, 68, 68);
  border-radius: 25px;
  border-style: none;
  padding: 12px 30px;
  font-size: 13px;
  font-family: 'Dancing Script', cursive;
  cursor: pointer;
  background: linear-gradient(145deg, #fceaff, #e0f7ff);
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(200, 180, 255, 0.3);
  transition: transform 0.2s ease, background-color 0.3s ease;
}

.input_submit:hover {
  transform: scale(1.05);
  background-color: #ff4fa7;
}

/* 送信ボタン: フォーカス時 */
.input_submit:focus {
  outline: none;
  box-shadow: 0 0 10px rgba(255, 182, 255, 0.5);
}
</style>

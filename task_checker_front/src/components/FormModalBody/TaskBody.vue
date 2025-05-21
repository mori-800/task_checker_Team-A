<script setup>
import Select from '../GenreSelect.vue'
import { ref,onMounted } from 'vue'
import { useTaskStore } from '../../stores/taskStore';
//ログインユーザー名をトップページに反映する　森
import  api from '../../api/axios';

import {Form, Field, defineRule, ErrorMessage } from 'vee-validate'; 
import { required, email, min, confirmed } from '@vee-validate/rules';

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('confirmed', confirmed);

//ユーザーリストを定義
const allUsers = ref([]);
const assigneeId = ref('')
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

const submitTask = async () => {
  // ✅ 担当者IDを設定
  //怪しい
  console.log("元データ:",assigneeId.value)
  console.log("空と表示される予定のデータ:",task.value.assigneeId)
  task.value.assigneeId = assigneeId.value
  console.log("元データと同じになるデータ:",task.value.assigneeId)
  try {
    await taskStore.addTask(task.value)
    emit('close-modal')
  } catch (error) {
    console.error("タスクの登録に失敗しました", error)
  }
}

</script>

<template>
  <Form class="modal_body">
    <h2 class="input_menu">タスクを追加</h2>
    <div>
      <h4 class="input_title">ジャンル</h4>
      <div class="task_genre">
        <Select @change="genreSelect" :value="task.genreId"/>
      </div>
      
      <h4 class="input_title">タイトル</h4>
       <Field type="text" id="name" class="input-field" name="name" rules="required" v-model="task.name"/>
       <ErrorMessage as="div" name="name" >
       <p>This field is required</p></ErrorMessage>
       
      <h4 class="input_title">説明</h4>
      <Field type="text" id="explanation" class="input-field" name="explanation" rules="required" v-model="task.explanation"/>
      <ErrorMessage as="div" name="explanation" >
      <p>This field is required</p></ErrorMessage>

      <h4 class="input_title">期限</h4>
      <Field type="date" id="deadlineDate" class="input-field" name="deadlineDate" rules="required" v-model="task.deadlineDate"/>
      <ErrorMessage as="div" name="deadlineDate" >
      <p>This field is required</p></ErrorMessage>
      <h4 class="input_title">担当者</h4>
      <Field name="assigneeId" rules="required">
        <select v-model="assigneeId" class="select">
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
    <input class="input_submit" type="button" value="送信" @click="submitTask"/>
  </Form>
</template>

<style>
  .modal_body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .genre_title {
    width: 200px;
    display: flex;
    justify-content: space-between;
  }
  .input_title {
    height: 3px;
  }
  input,
  textarea {
    border: none;
    background-color: #f3f3f3;
    padding: 16px;
    border-radius: 5px;
    width: 230px;
    line-height: 1.5em;
  }
  .input_submit {
    margin-top: 30px;
    background-color: rgb(66, 163, 247);
    color: white;
    border-radius: 25px;
    border-style: none;
    padding: 16px 40px;
    font-size: 15px;
  }
</style>
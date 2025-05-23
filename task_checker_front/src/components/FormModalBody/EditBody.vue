<script setup>
import Select from '../GenreSelect.vue'
import { ref } from 'vue'
import { useTaskStore } from '../../stores/taskStore';

// vee-validateのインポート 吉田
import { Form, Field, defineRule, ErrorMessage, configure } from 'vee-validate';
import { required } from '@vee-validate/rules';

// バリデーションルール定義 吉田
defineRule('required', required);

// デフォルトのバリデーションメッセージ設定 吉田
configure({
  generateMessage: (ctx) => {
    const messages = {
      required: 'This field is required',
    }
    return messages[ctx.rule.name] || 'Invalid field'
  }
})

// タスクストアの宣言 river
const taskStore = useTaskStore();

// Taskから{task}を取得する river
const props = defineProps({
  task: Object
})

// {task}の中身へ親要素からもらった{task}を代入 river
const task = ref({
  name: props.task.name,
  explanation: props.task.explanation,
  deadlineDate: props.task.deadlineDate,
  status: props.task.status,
  genreId: props.task.genreId
})

// ジャンルセレクトの処理 river
const genreSelect = (e) => {
  task.value.genreId = Number(e.target.value)
}

// 編集モーダルを閉じる river
const emit = defineEmits('close-modal')

// バリデーション成功時の送信処理 吉田
const onSubmit = async (values) => {
  task.value.name = values.name
  task.value.explanation = values.explanation

  try {
    console.log("実行前", task.value)
    await taskStore.updateTasks(props.task.id, task.value)
    console.log("実行後", task.value)
    emit('close-modal')
  } catch (error) {
    console.error("データの入力に誤りあり", error)
  }
}
</script>

<template>
  <!-- vee-validateのFormを使用 吉田 -->
  <Form class="modal_body" @submit="onSubmit">

    <h2 class="input_menu">タスクを編集</h2>
    <div>
      <h4 class="input_title">ジャンル</h4>
      <div class="task_genre">
        <Select @change="genreSelect" :value="task.genreId" />
      </div>

      <h4 class="input_title">タイトル</h4>
      <Field
        name="name"
        as="input"
        type="text"
        v-model="task.name"
        rules="required"
      />
      <ErrorMessage name="name" class="error-message" />

      <h4 class="input_title">説明</h4>
      <Field
        name="explanation"
        as="textarea"
        v-model="task.explanation"
        rules="required"
      />
      <ErrorMessage name="explanation" class="error-message" />

<h4 class="input_title">期限</h4>
<input class="input_date" type="date" v-model="task.deadlineDate" />
<div class="deadline-note">※変更されない場合は現在の期限を反映</div>
    </div>

    <input class="input_submit" type="submit" value="送信" />
  </Form>
</template>

<style scoped>
.modal_body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4vh 8vw;
  background: #fff0fa;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(255, 182, 255, 0.5);
  overflow: hidden;
  font-family: 'Comic Sans MS', cursive;
}

.input_menu {
  font-size: 26px;
  font-weight: bold;
  color: #ff66b2; /* ふんわりとしたピンク */
  margin-bottom: 24px;
  font-family: 'Comic Sans MS', cursive, sans-serif; /* 可愛さ重視 */
  text-shadow: 3px 3px 6px rgba(255, 182, 255, 0.6), 0 0 8px rgba(255, 153, 204, 0.4); /* ふわっと感、キラキラ光るような効果 */
  letter-spacing: 1px; /* 文字の間隔を少し広げて柔らかさを出す */
  white-space: nowrap; /* テキストが折り返さないように */
}


.input_title {
  font-size: 18px;
  color: #703c85;
  margin-bottom: 12px;
  text-shadow: 1px 1px 2px #ffccf9;
  font-family: 'Comic Sans MS', cursive;
  background: linear-gradient(145deg, #fceaff, #e0f7ff);
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(200, 180, 255, 0.3);
}

input,
textarea {
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  border: 2px dashed #ffccf9;
  border-radius: 10px;
  background-color: #fdf5ff;
  color: #703c85;
  font-size: 16px;
  font-family: 'Comic Sans MS', cursive;
}

.input_date {
  font-size: 16px;
}

.input_submit {
  width: 120px;
  padding: 12px;
  color: #703c85;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;
  background: linear-gradient(145deg, #fceaff, #e0f7ff);
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(200, 180, 255, 0.3);
}

.input_submit:hover {
  transform: scale(1.1);
  background-color: #ff99cc;
}

.error-message {
  color: red;
  font-size: 0.85rem;
  margin: 4px 0 12px 0; /* 上下に余白 */
  display: block;
}

.deadline-note {
  font-size: 14px;
  color: #ff66b2; /* 柔らかいピンク色 */
  font-family: 'Comic Sans MS', cursive, sans-serif;
  margin-top: 8px;
  text-align: center;
  padding: 5px 10px;
  border-radius: 8px;

}


</style>

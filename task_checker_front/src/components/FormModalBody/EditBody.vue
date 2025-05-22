<script setup>
import Select from '../Select.vue'
import { ref } from 'vue'
import { useTaskStore } from '../../stores/taskStore';

// vee-validateのインポート river
import { Form, Field, defineRule, ErrorMessage, configure } from 'vee-validate';
import { required } from '@vee-validate/rules';

// バリデーションルール定義 river
defineRule('required', required);

// デフォルトのバリデーションメッセージ設定 river
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

// バリデーション成功時の送信処理 river
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
  <!-- vee-validateのFormを使用 river -->
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
      <div>※変更されない場合は現在の期限を反映</div>
    </div>

    <input class="input_submit" type="submit" value="送信" />
  </Form>
</template>

<style>
.vm {
  height: 75vh;
  padding: 2vw 10vw;
  text-align: center;
  overflow-y: auto;
}

.error-message {
  color: red;
  font-size: 0.85rem;
  margin-top: 4px;
}
</style>

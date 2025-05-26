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
  genreId: props.task.genreId,
  assigneeId: props.task.assigneeId  // ← 追加
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

// ✅ 追加：ユーザーストアをインポート
import { useUserStore } from '../../stores/userStore';
import { computed, onMounted } from 'vue';

// ✅ 追加：ユーザーストアを使う
const userStore = useUserStore();

// ✅ 追加：担当者名を表示用に取得
const assigneeName = computed(() => {
  const user = userStore.users.find(u => u.uid === task.value.assigneeId)
  return user ? user.displayName || '（名前未登録）' : '不明なユーザー'
})

// ✅ 追加：ユーザー一覧を取得（初回マウント時）
onMounted(async () => {
  await userStore.fetchAllUsers()
})

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
      <div class="input_group">
      <Field
        name="name"
        as="input"
        type="text"
        v-model="task.name"
        rules="required"
      />
      <ErrorMessage name="name" class="error-message" /></div>

      <h4 class="input_title">説明</h4>
      <div class="input_group">
      <Field
        name="explanation"
        as="textarea"
        v-model="task.explanation"
        rules="required"
      />
      <ErrorMessage name="explanation" class="error-message" /></div>

      <h4 class="input_title">期限</h4>
      <input class="input_date" type="date" v-model="task.deadlineDate" />
      <div class="deadline-note">※変更されない場合は現在の期限を反映</div>
    </div>
    
<h4 class="input_title">担当者</h4>
<select v-model="task.assigneeId" class="input_select">
  <option disabled value="">-- 担当者を選択 --</option>
  <option
    v-for="user in userStore.users"
    :key="user.uid"
    :value="user.uid"
  >
    {{ user.displayName || '（名前未登録）' }}
  </option>
</select>

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
  background: linear-gradient(145deg, #fff0fa, #fceeff);
  border-radius: 15px;
  box-shadow: 0 6px 18px rgba(255, 182, 255, 0.5);
  font-family: 'Comic Sans MS', cursive;
}

/* 見出し */
.input_menu {
  font-size: 26px;
  font-weight: bold;
  color: #ff66b2;
  margin-bottom: 24px;
  text-shadow: 3px 3px 6px rgba(255, 182, 255, 0.6), 0 0 8px rgba(255, 153, 204, 0.4);
  letter-spacing: 1px;
  white-space: nowrap;
}

/* 各ラベル */
.input_title {
  display: block;
  width: fit-content;
  max-width: 100%;
  padding: 8px 16px;
  margin: 16px auto 12px auto;
  font-size: 18px;
  color: #c85fd8;
  font-family: 'Comic Sans MS', cursive;
  background: linear-gradient(135deg, #fceaff, #ffe4fa, #e0f7ff);
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(255, 182, 255, 0.4), inset 0 0 6px rgba(255, 200, 255, 0.3);
  border: 2px dotted #ffccf9;
  text-shadow: 1px 1px 2px #fff0fa, 0 0 4px #ffc8f9;
  text-align: center;
}

/* 入力系 */
input,
textarea,
.input_select {
  width: 150px;
  height: 18px;
  font-size: 16px;
  color: #703c85;
  background-color: #fdf5ff;
  border: none;
  border-radius: 12px; 
  border-bottom: 2px solid #ffccf9; 
  outline: none;
  padding: 8px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(255, 182, 255, 0.3); 
  transition: transform 0.2s ease;
}

/* ドロップダウンも同じ装飾 */
.input_select:focus,
input:focus,
textarea:focus {
  outline: none;
  background-color: #ffeefc;
  box-shadow: 0 0 8px #ffccf9;
}

/* 日付入力だけ個別指定 */
.input_date {
  font-size: 16px;
}

/* 期限メモ */
.deadline-note {
  font-size: 14px;
  color: #ff66b2;
  font-family: 'Comic Sans MS', cursive;
  text-align: center;
  margin-top: 8px;
  padding: 5px 10px;
  border-radius: 8px;
  background-color: #fff0f7;
  box-shadow: inset 0 0 6px rgba(255, 182, 255, 0.2);
}

.input_submit {
  display: inline-block; /* ブロック要素化して中身に合わせて伸縮 */
  padding: 12px 32px; /* 十分な内側余白を確保 */
  color: #651554;
  font-size: 16px;
  font-weight: bold;
  font-family: 'Comic Sans MS', cursive;
  background: linear-gradient(135deg, #e0f7ff, #fec4ed);
  border: 1.5px solid rgba(192, 152, 196, 0.4); /* パステルブルーの薄い枠 */
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(255, 182, 255, 0.3);
  cursor: pointer;
  white-space: nowrap; /* 改行させない */
  line-height: 1.5; /* 高さを確保 */
  min-height: 44px; /* ボタンの縦サイズが十分あるように */
  min-width: 160px; /* 十分な幅も確保 */
  text-align: center;
  transition: all 0.3s ease;
}

.input_submit:hover {
  background: linear-gradient(135deg, #b3e5ff, #ffccf9);
  border-color: rgba(124, 58, 130, 0.7); /* ホバー時に少し濃く */
  box-shadow: 0 10px 24px rgba(156, 104, 159, 0.5);
  transform: scale(1.05);
}


.input_submit:hover {
  transform: scale(1.05);
  background: linear-gradient(135deg, #ffb7eb, #ffe3f4);
}


.input_group {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px; /* フィールド間の余白 */
  width: 100%;
}
.error-message {
  color: #ff6699;
  font-size: 0.85rem;
  margin-top: 4px;
  text-align: center;
  font-family: 'Comic Sans MS', cursive;
}


.input_select {
  width: 150px;
  height: 35px;
  font-size: 16px;
  color: #703c85;
  background-color: #fdf5ff;
  border: none;
  border-radius: 12px; 
  border-bottom: 2px solid #ffccf9; 
  outline: none;
  padding: 8px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(255, 182, 255, 0.3); 
  transition: transform 0.2s ease;
  margin-bottom: 32px; /* ← この行を追加！ */
}
</style>


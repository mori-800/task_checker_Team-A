<script setup>
import StatusSelect from './StatusSelect.vue';
import { computed, ref, onMounted } from 'vue'
import FormModal from './FormModal.vue';
//UserStoreから取得する形に変更 森
import { useUserStore } from '../stores/userStore'
import { useTaskStore } from '../stores/taskStore';

const taskStore = useTaskStore();

const showModal=ref(false);
const userStore = useUserStore()

const props = defineProps({
  task: Object
})

//タスクの完了機能 追加機能なので今後残せるかは不明 森
const completeTask = async () => {
  // ✅ ステータスを Done に設定（インデックス5）
  props.task.status++
  // 保存処理
  await taskStore.updateTasks(props.task.id, props.task)
}
//ここまで

// 担当者名の算出（userStore.usersから一致するIDを探す）森
const assigneeName = computed(() => {
  const user = userStore.users.find(u => u.uid === props.task.assigneeId)
  return user ? user.displayName || '（名前未登録）' : '不明なユーザー'
})

// 初回取得（必要なら）森
onMounted(() => {
  
  if (userStore.users.length === 0) {
    userStore.fetchAllUsers()
  }
})

//taskがnullやundefinedの場合のガード 森
//以下はタスク完了機能を実装する場合のformattedDeadlineDateの記述 実装しない場合は上記のものを採用 森
const formattedDeadlineDate = computed(() => {
  if (!props.task || !props.task.deadlineDate) return '';
  const deadline = new Date(props.task.deadlineDate);
  if (props.task.status===5) {
    return '完了済み'
  }

  return deadline.toLocaleDateString('ja-JP');
});

const statusSelect = (e) => {
  props.task.status = Number(e.target.value)
  taskStore.changeTasksStatus(props.task)
}

const closeModal = () => {
  showModal.value = false
}


const taskStyle = computed(() => {
  // 現在の日時より deadlineDateが後であるかをチェック
  if(props.task.status<5){
    if (!props.task || !props.task.deadlineDate) return {};
      const isDeadlineAfterToday = new Date(props.task.deadlineDate) > new Date();
      // 条件に基づいてスタイルオブジェクトを返す
    return {
      backgroundColor: isDeadlineAfterToday ? 'white' : 'rgb(250, 194, 194)',
    };
  }
})

</script>

<template>
  <div class="task" :style="taskStyle">
    <FormModal v-model="showModal" body="detailBody" @close-modal="closeModal" :task="props.task"/>

    <span class="task_date">{{ formattedDeadlineDate }}</span>

    <div @click="showModal=true">
      <div class="task_text_contents">
        <h3 class="task_title">{{ task.name }}</h3>
        <p class="task_sentence">{{ task.explanation}}</p>
      </div>
      <!-- 👇 担当者名表示エリアを追加 森 -->
      <p class="assignee">担当者: {{ assigneeName }}</p>
    </div>

    <div class="task_input_contents">
      <StatusSelect @change="statusSelect" :tasks="props.task" />
      <!-- タスクの完了ボタン 追加機能なので今後残せるかは不明 森 -->
      <button class="complete-button" @click.stop="completeTask" v-if="props.task.status<5">NEXT</button>
    </div>
  </div>
</template>

<style scoped>
/* タスクカード */
.task {
  background-color: white; /* やさしいピンク */
  max-height: 350px;
  width: 300px;
  margin-bottom: 20px;
  border-radius: 20px; /* 角を丸く */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  cursor: pointer;
  top: 0;
  transition: top 0.2s ease, left 0.2s ease, box-shadow 0.2s ease;
}

.task:hover {
  top: -4px;
  left: -4px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1); /* より強調した影 */
}

/* タスクのテキスト */
.task_text_contents {
  padding: 25px 35px 0 25px; /* 内側の余白を調整 */
}

.task_title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #947386; /* ゆめかわいピンク */
  font-size: 18px; /* タイトル少し大きめ */
  font-family: 'Dancing Script', cursive; /* 夢かわいいフォント */
  margin-bottom: 12px;
  font-weight: bold; /* 太めの文字 */
}

/* タスクの説明 */
.task_sentence {
  overflow: hidden;
  color: rgb(70, 70, 70);
  font-size: 13px;
  text-align: start;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

/* 日付のスタイル */
.task_date {
  position: absolute;
  top: 15px;
  left: 20px;
  color: rgb(133, 133, 133);
  font-size: 12px;
  font-family: 'Cursive', sans-serif; /* 優しい手書き風 */
}

/* タスクの入力部分 */
.task_input_contents {
  padding: 0 20px 20px 20px;
}


/* 担当者名のスタイル */
.assignee {
  font-size: 12px;
  color: rgb(70, 70, 70);
  padding-left: 20px;
  margin-top: 12px;
  font-family: 'Dancing Script', cursive; /* かわいいフォント */
}

/* 背景とアイコンの追加 */
.task .task_title::before {
  content: '🐰'; /* タイトルの前に小さなアイコンを追加 */
  margin-right: 10px;
  font-size: 18px;
}

.task_input_contents {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px 20px 20px;
  gap: 10px; /* ボタンとセレクトの間隔 */
}

/* 完了ボタン 実装未定 森 */
.complete-button {
  /* 不要な margin を削除 */
  background: linear-gradient(135deg, #ffd9f7, #d9eaff); /* ピンク〜水色グラデ */
  color: #a64ac9; /* ラベンダーパープル */
  border: 2px solid #fcdfff;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(255, 182, 255, 0.4);
  transition: all 0.3s ease;
  font-family: 'Comic Sans MS', 'Segoe UI', cursive;
}

.complete-button:hover {
  background: linear-gradient(135deg, #ffe6fa, #e0f0ff); /* 少し明るめに */
  color: #ff69b4;
  transform: scale(1.05) rotate(-1deg);
  box-shadow: 0 6px 12px rgba(255, 182, 255, 0.6);
}


</style>


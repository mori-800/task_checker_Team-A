<script setup>
import StatusSelect from './StatusSelect.vue';
import { computed, ref, onMounted } from 'vue'
import FormModal from './FormModal.vue';
//UserStoreから取得する形に変更 森
import { useUserStore } from '../stores/userStore'

const showModal=ref(false);
const userStore = useUserStore()

const props = defineProps({
  task: Object
})

// 担当者名の算出（userStore.usersから一致するIDを探す）森
const assigneeName = computed(() => {
  const user = userStore.users.find(u => u.uid === props.task.assigneeId)
  return user ? user.displayName || '（名前未登録）' : '不明なユーザー'
})

// 初回取得（必要なら）森
onMounted(() => {
  if (userStore.users.length === 0) {
    userStore.fetchUsers()
  }
})

//taskがnullやundefinedの場合のガード 森

const formattedDeadlineDate = computed(() => {
  if (!props.task || !props.task.deadlineDate) return '';
  const date = new Date(props.task.deadlineDate)
  return date.toLocaleDateString('ja-JP')
})

const statusSelect = (e) => {
  props.task.status = Number(e.target.value)
  taskStore.changeTasksStatus(props.task)
}

const closeModal = () => {
  showModal.value = false
}


const taskStyle = computed(() => {
  // 現在の日時より deadlineDate が後であるかをチェック
  if (!props.task || !props.task.deadlineDate) return {};
  const isDeadlineAfterToday = new Date(props.task.deadlineDate) > new Date();
  // 条件に基づいてスタイルオブジェクトを返す
  return {
    backgroundColor: isDeadlineAfterToday ? 'white' : 'rgb(250, 194, 194)',
  };
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
      <div v-if="task.image_url" class="image-container">
        <div class="image-wrapper">
          <img
            :src="task.image_url"
            class="task-image"
          />
        </div>
      </div>
      <!-- 👇 担当者名表示エリアを追加 森 -->
      <p class="assignee">担当者: {{ assigneeName }}</p>
    </div>
    <div className="task_input_contents">
      <StatusSelect @change="statusSelect":tasks="props.task"/>
    </div>
  </div>
</template>

<style>
.task {
  background-color: white;
  max-height: 350px;
  width: 300px;
  margin-bottom: 20px;
  border-radius: 5px;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
  position: relative;
  cursor: pointer;
  top: 0;
  transition: top left ease 0.2s;
}

.task:hover {
  top: -2px;
  left: -2px;
  box-shadow: 0 5px 8px rgba(0, 0, 0, 0.1);
}

.task_text_contents {
  padding: 30px 45px 0 20px;
}

.task_title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: rgb(70, 70, 70);
  font-size: 15px;
  margin-bottom: 10px;
}

.task_sentence {
  overflow: hidden;
  color: rgb(70, 70, 70);
  font-size: 12px;
  text-align: start;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.task_date {
  position: absolute;
  top: 20px;
  left: 20px;
  color: rgb(133, 133, 133);
  font-size: 11px;
}

.task_input_contents {
  padding: 0 20px 20px 20px;
}


.image-container {
  width: 100px;
  height: 100px;
  overflow: hidden;
  margin-left: 20px;
}

.image-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.task-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
/* 👇 担当者名のスタイル追加 */
.assignee {
  font-size: 12px;
  color: rgb(70, 70, 70);
  padding-left: 20px;
  margin-top: 10px;
}
</style>
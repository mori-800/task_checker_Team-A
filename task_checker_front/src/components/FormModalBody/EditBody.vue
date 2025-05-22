<script setup>
import Select from '../Select.vue'
import { ref } from 'vue'
import { useTaskStore } from '../../stores/taskStore';

//タスクストアの宣言 river
const taskStore = useTaskStore();

//Taskから{task}を取得する river
const props = defineProps({
  task: Object
})

//{task}の中身へ親要素からもらった{task}を代入 river
const task = ref({
  name: props.task.name,
  explanation: props.task.explanation,
  deadlineDate: props.task.deadlineDate,
  status: props.task.status,
  genreId: props.task.genreId
})
const genreSelect = (e) => {
  task.value.genreId = Number(e.target.value)
}


//送信ボタンを押したら編集モーダルを閉じる river
const emit = defineEmits('close-modal') 
const submitTask = async() => {
  try{
    console.log("実行前",task.value)
    //タスクストアにタスクを追加 river
    await taskStore.updateTasks(
      props.task.id,
      task.value,
    );
    console.log("実行後",task.value)
    emit('close-modal')
  }catch(error){
    console.error("データの入力に誤りあり",error)
  }
  
}

</script>

<template>
  <form class="modal_body">
    <h2 class="input_menu">タスクを編集</h2>
    <div>
      <h4 class="input_title">ジャンル</h4>
      <div class="task_genre">
        <Select @change="genreSelect" :value="task.genreId"/>
      </div>
      <h4 class="input_title">タイトル</h4>
      <input type="text" v-model="task.name"/>
      <h4 class="input_title">説明</h4>
      <textarea v-model="task.explanation"/>
      <h4 class="input_title">期限</h4>
      <input class="input_date" type="date" v-model="task.deadlineDate"/>
      <div>※変更されない場合は現在の期限を反映</div>
    </div>
    <input class="input_submit" type="button" value="送信" @click="submitTask"/>
  </form>
</template>

<style>
.vm {
  height: 75vh;
  padding: 2vw 10vw;
  text-align: center;
  overflow-y: auto;
}
</style>
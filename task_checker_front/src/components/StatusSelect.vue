<script setup>

const props = defineProps({
  tasks: Object
})
const taskStatusElements = [
    "ToDo",
    "Pending",
    "Doing(ToDay)",
    "WIP",
    "Check",
    "Done",
  ]
</script>

<template>
  <select v-model="tasks.status" class="select" :value="tasks.status">
    <option :value="index" v-for="(status,index) in taskStatusElements" :key="index">{{ status }}</option>
  </select>
</template>
<style scoped>
.select {
  width: 150px;
  height: 35px; /* 少し高さを増やして、選びやすく */
  font-size: 16px; /* フォントサイズを少し大きく */
  color: #703c85; /* 夢かわいい色の文字 */
  background-color: #f9f9f9; /* 薄いグレーの背景 */
  border: none;
  border-radius: 12px; /* 丸みを持たせる */
  border-bottom: 2px solid #ffccf9; /* ピンク色のボーダー */
  outline: none;
  padding: 8px 12px; /* 内側に少し余白を */
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(255, 182, 255, 0.3); /* 優しい影 */
  transition: transform 0.2s ease; /* ホバー時に拡大 */
}


</style>
<script setup>
import { auth, signInWithEmailAndPassword } from '../firebase'
import Header from './Header.vue'
import { useRouter } from 'vue-router'

//ログイン失敗表示用 森
import { ref } from 'vue'
const errorMessage = ref('')

// vee-validate 関連のインポート
import { defineRule, configure, useField } from 'vee-validate'
import { required, email as emailRule } from '@vee-validate/rules'

// バリデーションルールの定義
defineRule('required', required)
defineRule('email', emailRule)

// カスタムルール：6文字以上
defineRule('min6', value => {
  if (!value || value.length < 6) {
    return 'password is not valid'
  }
  return true
})

// カスタムルール：英数字混合
defineRule('alphanumeric', value => {
  if (!value) return true // 他のルールに任せる
  const hasLetter = /[a-zA-Z]/.test(value)
  const hasNumber = /[0-9]/.test(value)
  if (!(hasLetter && hasNumber)) {
    return 'password should be in mix of letters and numbers'
  }
  return true
})

// メッセージ設定
configure({
  generateMessage: (context) => {
    const messages = {
      required: 'This field is required',
      email: 'email is not valid'
    }
    return messages[context.rule.name] || '入力エラーがあります'
  }
})

// 各フィールドの定義
const { value: email, errorMessage: emailError, validate: validateEmail } = useField('email', 'required|email')
const { value: password, errorMessage: passwordError, validate: validatePassword } = useField('password', 'required|min6|alphanumeric')

const router = useRouter()

const handleSignIn = async () => {
  const emailValid = await validateEmail()
  const passwordValid = await validatePassword()

  if (!emailValid.valid || !passwordValid.valid) return

 try {
  await signInWithEmailAndPassword(auth, email.value, password.value)
  router.push("/home")
} catch (error) {
  console.log('ログインに失敗しました')
  errorMessage.value = 'ログインに失敗しました。メールアドレスまたはパスワードが間違っています。'
}
}
</script>

<template>
  <Header />
  <div class="form-body">
    <h1>ログイン</h1>

    <p v-if="errorMessage" class="errorMessage">{{ errorMessage }}</p>


    <input type="text" id="email" v-model="email" placeholder="email" />
    <span style="color: red">{{ emailError }}</span>

    <input type="password" id="password" v-model="password" placeholder="password" />
    <span style="color: red">{{ passwordError }}</span>

    <button @click="handleSignIn">ログイン</button>

    <p>アカウント作成がお済みでない場合は<router-link to="/signup">こちら</router-link></p>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&family=Rock+Salt&display=swap');

.form-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 60vh; /* フォームの高さ調整 */
  padding: 4vw 8vw; /* スペース調整 */
  text-align: center;
  background-color: #fdf4ff; /* 明るいパステルピンク背景 */
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); /* ソフトな影 */
  width: 90%; /* 幅調整 */
  max-width: 380px;
  margin-top: 30px; /* ヘッダーとの隙間を確保 */
  margin-left: auto;
  margin-right: auto;
  font-family: 'Poppins', sans-serif; /* フォームの全体的なフォント */
}

.errorMessage{
  color: red;
  margin-bottom: 10px;
}


h2 {
  font-size: 26px;
  color: #ff66b3; /* タイトルの色をピンクに */
  margin-bottom: 20px;
  font-family: 'Rock Salt', cursive; /* タイトルを手書き風で可愛く */
}

input {
  margin-bottom: 20px;
  padding: 12px 20px;
  width: 100%;
  border-radius: 25px;
  border: 2px solid #ffb3d9; /* 優しいピンク色の枠 */
  font-size: 14px;
  background-color: #fff0f6; /* 優しい白ピンク */
  color: #6c4f8c; /* 柔らかい紫 */
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif; /* 入力フィールドのフォント */
}

input:focus {
  outline: none;
  border-color: #ff80c0; /* フォーカス時のピンク */
  box-shadow: 0 0 10px rgba(255, 128, 192, 0.5);
}

button {
  background-color: #ff80c0; /* 明るいピンクボタン */
  color: white;
  border-radius: 6px;
  border-style: none;
  padding: 14px 32px;
  margin-top: 10px;
  font-size: 16px;
  width: 100%;
  transition: all 0.3s ease;
  cursor: pointer;
  font-family: 'Poppins', sans-serif; /* ボタンのフォント */
}

button:hover {
  background-color: #ff66b3; /* ホバー時に色が少し濃くなる */
}

button:active {
  transform: scale(0.98); /* 押したときのアニメーション */

}
</style>

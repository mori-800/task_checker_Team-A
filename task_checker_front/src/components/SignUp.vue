<script setup>
import Header from './Header.vue'
import { auth, createUserWithEmailAndPassword, updateProfile } from '../firebase'
import { useRouter } from 'vue-router'
import api from '../api/axios'

//サインアップ失敗表示用 森
import { ref } from 'vue'
const errorMessage = ref('')

// vee-validate 関連
import { defineRule, configure, useField } from 'vee-validate'
import { required, email as emailRule } from '@vee-validate/rules'

// 🔧 バリデーションルール定義
defineRule('required', required)
defineRule('email', emailRule)
defineRule('min6', value => {
  if (!value || value.length < 6) return 'password is not valid'
  return true
})
defineRule('alphanumeric', value => {
  if (!value) return true
  const hasLetter = /[a-zA-Z]/.test(value)
  const hasNumber = /[0-9]/.test(value)
  if (!(hasLetter && hasNumber)) {
    return 'password should be in mix of letters and numbers'
  }
  return true
})
defineRule('nicknameFormat', value => {
  if (!value) return true
  const regex = /^[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}0-9]+$/u
  if (!regex.test(value)) {
    return 'nickname should be in full-width Hiragana, Katakana, Kanji characters or Number'
  }
  return true
})

// ✉️ エラーメッセージのカスタマイズ
configure({
  generateMessage: (context) => {
    const messages = {
      required: 'This field is required',
      email: 'email is not valid',
    }
    return messages[context.rule.name] || '入力エラーがあります'
  }
})

// 📋 各フィールドとバリデーションルール
const { value: email, errorMessage: emailError, validate: validateEmail } = useField('email', 'required|email')
const { value: password, errorMessage: passwordError, validate: validatePassword } = useField('password', 'required|min6|alphanumeric')
const { value: nickname, errorMessage: nicknameError, validate: validateNickname } = useField('nickname', 'required|nicknameFormat')

const router = useRouter()

// 🔐 登録処理
const handleSignUp = async () => {
  const emailValid = await validateEmail()
  const passwordValid = await validatePassword()
  const nicknameValid = await validateNickname()

  if (!emailValid.valid || !passwordValid.valid || !nicknameValid.valid) return

  //Firebase Auth に登録
  try {
    const credentialUser = await createUserWithEmailAndPassword(auth, email.value, password.value)
    const user = credentialUser.user

    //Firebase にdisplayNameを登録
    await updateProfile(user, {
      displayName: nickname.value
    })

    //バックエンドのDBにユーザー情報を保存
    await api.post('/users', {
      uid: user.uid,
      email: user.email,
      displayName: nickname.value,
      photoURL: user.photoURL || null,
    })

    router.push("/home")
  } catch (error) {
    console.log('ユーザー登録できませんでした', error)
    errorMessage.value = '登録に失敗しました。メールアドレスまたはパスワードが間違っています。'
  }
}
</script>

<template>
  <Header />
  <div class="form-body">
    <h1>新規登録</h1>

     <p v-if="errorMessage" class="errorMessage">{{ errorMessage }}</p>

    <input type="text" id="email" v-model="email" placeholder="email" />
    <span style="color: red">{{ emailError }}</span>

    <input type="password" id="password" v-model="password" placeholder="password" />
    <span style="color: red">{{ passwordError }}</span>

    <input type="text" id="nickname" v-model="nickname" placeholder="nickname" />
    <span style="color: red">{{ nicknameError }}</span>

    <button @click="handleSignUp">新規登録</button>

    <p>既にアカウントをお持ちの方は<router-link to="/">こちら</router-link></p>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&family=Rock+Salt&display=swap');

.form-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 60vh; /* フォームの高さを調整 */
  padding: 4vw 8vw; /* 内側の余白を広げる */
  text-align: center;
  background-color: #fdf4ff; /* 明るいパステルピンク背景 */
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); /* ソフトな影を追加 */
  width: 90%; /* 幅を90%に設定 */
  max-width: 380px;
  margin-top: 30px; /* ヘッダーとの隙間を確保 */
  margin-left: auto;
  margin-right: auto;
  font-family: 'Poppins', sans-serif; /* ポップなフォント */
}

.errorMessage{
  color: red;
  margin-bottom: 10px;
}

h2 {
  font-size: 26px;
  color: #ff66b3; /* タイトルのピンク色 */
  margin-bottom: 20px;
  font-family: 'Rock Salt', cursive; /* 手書き風のフォントで可愛さアップ */
}

input {
  margin-bottom: 16px;
  padding: 12px 20px;
  width: 100%;
  border-radius: 25px;
  border: 2px solid #ffb3d9; /* 優しいピンク色の枠線 */
  font-size: 14px;
  background-color: #fff0f6; /* 柔らかいピンクの背景 */
  color: #6c4f8c; /* 落ち着いた紫色 */
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
}

input:focus {
  outline: none;
  border-color: #ff80c0; /* フォーカス時のピンク色 */
  box-shadow: 0 0 10px rgba(255, 128, 192, 0.5);
}

button {
  background-color: #ff80c0; /* 明るいピンク色のボタン */
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
  transform: scale(0.98); /* 押したときに少し小さくなるエフェクト */

}
</style>


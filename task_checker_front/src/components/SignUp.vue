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
    
    router.push("/home")
  } catch (error) {
    console.log('ユーザー登録できませんでした', error)
    errorMessage.value = '登録に失敗しました。\nメールアドレスまたはパスワードが間違っています。'
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
.form-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: auto;
  padding: 4vw 8vw;
  text-align: center;
  background: linear-gradient(145deg, #dcf2fc, #fef4fb); /* パステルブルーとピンクのグラデ */
  border-radius: 24px;
  box-shadow: 0 10px 20px rgba(255, 182, 255, 0.2), 0 6px 12px rgba(172, 216, 230, 0.3);
  width: 90%;
  max-width: 400px;
  margin: 40px auto 0;
  font-family: 'Yu Gothic UI', 'Hiragino Maru Gothic Pro', sans-serif;
  border: 2px dashed #fdd7f3; /* ゆるふわ感を出すためにダッシュボーダー */
}

.errorMessage{
  color: red;
  margin-bottom: 10px;
  white-space: pre-line;
  width: 120%;

}

h2 {
  font-size: 26px;
  color: #ff88c2; /* パステルピンク */
  margin-bottom: 20px;
  font-weight: bold;
  text-shadow: 1px 1px 3px #ffe6f2;
  letter-spacing: 1px;
}

input {
  margin-bottom: 16px;
  padding: 14px 20px;
  width: 100%;
  border-radius: 28px;
  border: 2px solid #fcbde6; /* ピンクのボーダー */
  background-color: #f7fbff; /* ふんわりブルー */
  font-size: 15px;
  color: #5f4b8b; /* ちょっと甘めな紫文字 */
  box-shadow: inset 0 2px 6px rgba(255, 182, 255, 0.2);
  transition: all 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #ffa8d3;
  box-shadow: 0 0 8px rgba(255, 160, 200, 0.5);
}

button {
  background: linear-gradient(to right, #ffd6f7, #cceeff); /* ピンク×ブルーの夢グラデ */
  color: #944ba1;
  font-weight: bold;
  border-radius: 30px;
  border: none;
  padding: 14px 32px;
  font-size: 16px;
  width: 100%;
  margin-top: 10px;
  box-shadow: 0 4px 10px rgba(255, 200, 255, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
}

button:hover {
  background: linear-gradient(to right, #ffe9fb, #e6f9ff);
  transform: scale(1.03);
  color: #ff69b4;
  box-shadow: 0 6px 12px rgba(255, 182, 255, 0.5);
}

button:active {
  transform: scale(0.96);
}

</style>


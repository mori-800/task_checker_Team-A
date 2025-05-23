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
  errorMessage.value = 'ログインに失敗しました。\nメールアドレスまたはパスワードが間違っています。'
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
.form-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: auto;
  padding: 4vw 8vw;
  text-align: center;
  background: linear-gradient(145deg, #dcf2fc, #fef4fb); /* パステルブルー×ピンクのふんわりグラデ */
  border-radius: 24px;
  box-shadow: 0 10px 20px rgba(172, 216, 230, 0.3), 0 6px 12px rgba(255, 200, 255, 0.3);
  width: 90%;
  max-width: 400px;
  margin: 40px auto 0;
  font-family: 'Yu Gothic UI', 'Hiragino Maru Gothic Pro', sans-serif;
  border: 2px dashed #fce5ff; /* やわらかピンクでゆめかわボーダー */
}

.errorMessage{
  color: red;
  margin-bottom: 10px;
  white-space: pre-line;
  width: 120%;
}


h2 {
  font-size: 26px;
  color: #ff88c2; /* パステルピンク見出し */
  margin-bottom: 20px;
  font-weight: bold;
  text-shadow: 1px 1px 3px #ffe6f2;
  letter-spacing: 1px;
}

input {
  margin-bottom: 20px;
  padding: 14px 20px;
  width: 100%;
  border-radius: 28px;
  border: 2px solid #fcbde6; /* ピンクの縁取り */
  background-color: #f7fbff; /* パステルブルーっぽい入力背景 */
  font-size: 15px;
  color: #6c4f8c; /* やさしいパープル */
  box-shadow: inset 0 2px 6px rgba(255, 182, 255, 0.15);
  transition: all 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #ffa8d3;
  box-shadow: 0 0 10px rgba(255, 160, 200, 0.4);
}

button {
  background: linear-gradient(to right, #ffd6f7, #cceeff); /* ピンク×ブルーのやさしめグラデ */
  color: #703c85; /* 少し濃いめのラベンダー */
  font-weight: bold;
  border-radius: 30px;
  border: none;
  padding: 14px 32px;
  font-size: 16px;
  width: 100%;
  margin-top: 10px;
  box-shadow: 0 4px 10px rgba(200, 200, 255, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
}

button:hover {
  background: linear-gradient(to right, #ffe9fb, #e6f9ff);
  transform: scale(1.03);
  color: #ff69b4;
  box-shadow: 0 6px 12px rgba(255, 182, 255, 0.4);
}

button:active {
  transform: scale(0.96);
}

</style>

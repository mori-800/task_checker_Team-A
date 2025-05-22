<script setup>
import { auth, signInWithEmailAndPassword } from '../firebase'
import Header from './Header.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

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
  }
}
</script>

<template>
  <Header />
  <div class="form-body">
    <h1>ログイン</h1>

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
  height: 50vh;
  padding: 2vw 10vw;
  text-align: center;
}

input {
  margin-bottom: 16px;
}

button {
  background-color: rgb(66, 163, 247);
  color: white;
  border-radius: 6px;
  border-style: none;
  padding: 8px 20px;
  margin-bottom: 8px;
  font-size: 15px;
  width: 180px;
}
</style>
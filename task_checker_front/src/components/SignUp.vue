<script setup>
import Header from './Header.vue'
import { auth, createUserWithEmailAndPassword, updateProfile } from '../firebase'
import { useRouter } from 'vue-router'
import api from '../api/axios'
import { ref } from 'vue'

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
  }
}
</script>

<template>
  <Header />
  <div class="form-body">
    <h1>新規登録</h1>

    <input type="text" id="email" v-model="email" placeholder="email" />
    <span style="color: red">{{ emailError }}</span>

    <input type="password" id="password" v-model="password" placeholder="password" />
    <span style="color: red">{{ passwordError }}</span>

    <input type="text" id="nickname" v-model="nickname" placeholder="nickname" />
    <span style="color: red">{{ nicknameError }}</span>

    <button @click="handleSignUp">新規登録</button>

    <p>既にアカウントをお持ちの方はこちらへ<router-link to="/">こちら</router-link></p>
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
  margin-bottom: 8px;
}

button {
  background-color: rgb(66, 163, 247);
  color: white;
  border-radius: 25px;
  border-style: none;
  padding: 8px 20px;
  margin-bottom: 8px;
  font-size: 15px;
  width: 246px;
}
</style>

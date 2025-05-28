<template>
  <div class="borderBox confirmEmail" style="padding: 30px;">
    <h2>Wpisz kod weryfikacyjny oraz adres e-mail</h2>

    <input
      class="stdInput"
      v-model="email"
      type="email"
      placeholder="Adres e-mail"
      required
    />
    <input
      class="stdInput"
      v-model="token"
      type="text"
      placeholder="Kod weryfikacyjny"
      required
    />

    <button class="stdButton" @click="confirmEmail">Potwierdź</button>

    <p v-if="message" style="margin-top: 20px;">{{ message }}</p>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'ConfirmEmail',
  setup() {
    const email = ref('')
    const token = ref('')
    const message = ref('')
    const router = useRouter()

    const confirmEmail = async () => {
      if (!email.value || !token.value) {
        message.value = 'Podaj adres e-mail i kod weryfikacyjny.'
        return
      }

      const url = `${import.meta.env.VITE_API_URL}/email/confirm/${encodeURIComponent(email.value)}/${encodeURIComponent(token.value)}`

      try {
        const response = await fetch(url)
        const data = await response.json()

        if (!response.ok) throw new Error(data.message || 'Błąd serwera.')

        message.value = data.message || 'Email został potwierdzony!'
        router.push('/logowanie')
      } catch (error) {
        message.value = error.message || 'Błąd podczas potwierdzania emaila.'
      }
    }

    return {
      email,
      token,
      message,
      confirmEmail
    }
  }
}
</script>

<style src="../assets/home.css"></style>

<style>
.confirmEmail {
  min-width: 40%;
}
</style>

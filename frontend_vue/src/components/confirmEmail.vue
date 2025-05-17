<template>
  <div class="borderBox confirmEmail" style="padding: 30px;">
    <h2>Wpisz kod weryfikacyjny mail</h2>
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
    const token = ref('')
    const message = ref('')
    const router = useRouter()

    const confirmEmail = async () => {
      const email = localStorage.getItem('email')

      if (!email) {
        message.value = 'Brak adresu email w localStorage.'
        return
      }

      const url = import.meta.env.VITE_API_URL + `/email/confirm/${encodeURIComponent(email)}/${encodeURIComponent(token.value)}`

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

<template>
  <header class="headerHome">
    <div class="logo">Eventory</div>
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/about">O nas</router-link></li>
        <li><router-link to="/contact">Kontakt</router-link></li>
      </ul>
    </nav>
    <div class="user-actions">
      <template v-if="isLoggedIn">
        <router-link to="/dashboard"><button class="home-button">Dashboard</button></router-link>
        <button class="home-button logout-button" @click="logout">Wyloguj</button>
      </template>
      <template v-else>
        <router-link to="/rejestracja"><button class="home-button">Zarejestruj się</button></router-link>
        <router-link to="/logowanie"><button class="home-button">Zaloguj się</button></router-link>
      </template>
    </div>
  </header>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import emitter from '../eventBus'

export default {
  name: 'HeaderComponent',
  setup() {
    const isLoggedIn = ref(false)
    const router = useRouter()

    const checkLoginStatus = async () => {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        isLoggedIn.value = false
        return
      }

      try {
        const res = await fetch(import.meta.env.VITE_API_URL + '/auth/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        isLoggedIn.value = res.ok
      } catch (err) {
        console.error('Błąd sprawdzania sesji:', err)
        isLoggedIn.value = false
      }
    }

    const updateLoginStatus = (status) => {
      isLoggedIn.value = status
    }

    const logout = () => {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      isLoggedIn.value = false
      emitter.emit('auth-change', false)
      router.push('/')
    }

    onMounted(() => {
      checkLoginStatus()
      emitter.on('auth-change', updateLoginStatus)
    })

    onUnmounted(() => {
      emitter.off('auth-change', updateLoginStatus)
    })

    return {
      isLoggedIn,
      logout
    }
  }
}
</script>

<style src="../assets/home.css"></style>

<style scoped>
.logout-button {
  background-color: #7c0602;
  color: white;
  border: none;
  padding: 10px 15px;
  margin-left: 10px;
  cursor: pointer;
  border-radius: 4px;
}
</style>

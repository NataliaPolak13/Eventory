<template>
  <div class="dashboard-container">
    <NavBarComponent />
    <div class="dashboard-main">
      <h2 class="title">Twoje dane</h2>

      <div class="card" v-if="user">
        <h2>Witaj {{ user.fullName }}</h2>
        <p c><strong>Nazwa użytkownika:</strong> {{ user.username }}</p>
        <p c><strong>Bio:</strong> {{ user.bio ?? 'Brak' }}</p>
        <p c><strong>Numer kontaktowy:</strong> {{ user.contactNumber ?? 'Brak' }}</p>
        <p c><strong>Data utworzenia konta:</strong> {{ formatDate(user.createdAt) }}</p>

        <div class="event-actions" style="margin-top: 1.5rem;">
          <button @click="editProfile">Edytuj dane</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBarComponent from './NavBarComponent.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'UserProfile',
  components: { NavBarComponent },
  setup() {
    const user = ref(null)
    const router = useRouter()

    const formatDate = (dateStr) => {
      return new Date(dateStr).toLocaleString('pl-PL', {
        dateStyle: 'short',
        timeStyle: 'short'
      })
    }

    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        router.push('/logowanie')
        return false
      }

      const res = await fetch(import.meta.env.VITE_API_URL + '/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'access', token })
      })

      const data = await res.json()
      if (!data.isValid) {
        router.push('/logowanie')
        return false
      }

      return true
    }

    const loadUserData = async () => {
      const res = await fetch(import.meta.env.VITE_API_URL + '/users/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })

      if (res.ok) {
        user.value = await res.json()
      } else {
        alert('Nie udało się pobrać danych użytkownika')
      }
    }

    const editProfile = () => {
      router.push('/dashboard/editUser')
    }

    onMounted(async () => {
      const isValid = await checkAuth()
      if (isValid) {
        await loadUserData()
      }
    })

    return {
      user,
      formatDate,
      editProfile
    }
  }
}
</script>

<style scoped>
</style>

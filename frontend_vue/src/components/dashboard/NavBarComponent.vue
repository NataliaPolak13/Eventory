<template>
  <nav class="dashboard-nav borderBox">
    <div class="nav-buttons">
      <router-link to="/dashboard">
        <button class="nav-item smallBorderBox">Home</button>
      </router-link>
      <router-link to="/dashboard/eventList">
        <button class="nav-item smallBorderBox">Lista Wydarzeń</button>
      </router-link>
      <router-link to="/dashboard/myEvents">
        <button class="nav-item smallBorderBox">Twoje Wydarzenia</button>
      </router-link>
      <router-link to="/dashboard/userProfile">
        <button class="nav-item smallBorderBox">O mnie</button>
      </router-link>
      <router-link v-if="isAdmin" to="/dashboard/admin">
        <button class="nav-item smallBorderBox">Admin Panel</button>
      </router-link>
    </div>
  </nav>
</template>


<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'NavBarComponent',
  setup() {
    const isAdmin = ref(false)

    const fetchRoles = async () => {
      const token = localStorage.getItem('accessToken')
      if (!token) return

      try {
        const res = await fetch(import.meta.env.VITE_API_URL + '/roles/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('Błąd przy pobieraniu ról.')

        const roles = await res.json()
        isAdmin.value = roles.some(role => role.name === 'admin')
      } catch (e) {
        console.error('Błąd podczas pobierania ról:', e)
      }
    }

    onMounted(fetchRoles)

    return {
      isAdmin
    }
  }
}
</script>

<style src="../../assets/dashboard.css"></style>

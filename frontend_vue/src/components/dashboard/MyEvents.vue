<template>
  <div class="dashboard-container">
    <NavBarComponent />
    <div class="dashboard-main borderBox">
        <h2>Utwórz nowe wydarzenie</h2>
         <div class="event-actions">
            <router-link to="/dashboard/createEvent"><button>Utwórz nowe</button></router-link>
          </div>

      <h2>Twoje wydarzenia</h2>
      <ul v-if="events.length > 0" class="event-list">
        <li v-for="event in events" :key="event.id" class="event-item">
          <div class="event-name">{{ event.name }}</div>
          <div class="event-status">Status: {{ getStatus(event) }}</div>
          <div class="event-actions">
            <button @click="goToPreview(event.id)">Podgląd</button>
            <button @click="goToEdit(event.id)">Edytuj</button>
          </div>
        </li>
      </ul>
      <p v-else>Brak wydarzeń</p>
    </div>
  </div>
</template>

<script>
import NavBarComponent from './NavBarComponent.vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'MyEvents',
  components: { NavBarComponent },
  setup() {
    const router = useRouter()
    const events = ref([])

    const fetchMyEvents = async (token) => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL + '/events/me/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!res.ok) throw new Error('Błąd podczas pobierania wydarzeń użytkownika')
        const data = await res.json()
        events.value = data
      } catch (error) {
        console.error(error)
      }
    }

    const getStatus = (event) => {
      const now = new Date()
      const start = new Date(event.startDate)
      const end = new Date(event.endDate)

      if (now < start) return 'Nadchodzące'
      if (now >= start && now <= end) return 'W trakcie'
      return 'Zakończone'
    }

    const goToPreview = (id) => router.push(`/dashboard/event/${id}`)
    const goToEdit = (id) => router.push(`/dashboard/editEvent/${id}`)

    onMounted(async () => {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        router.push('/logowanie')
        return
      }

      const verifyRes = await fetch(import.meta.env.VITE_API_URL + '/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'access', token: accessToken })
      })

      const verifyData = await verifyRes.json()
      if (!verifyData.isValid) {
        router.push('/logowanie')
        return
      }

      await fetchMyEvents(accessToken)
    })

    return {
      events,
      getStatus,
      goToPreview,
      goToEdit
    }
  }
}
</script>

<style scoped>

</style>

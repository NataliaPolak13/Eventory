<template>
  <div class="dashboard-container">
    <NavBarComponent />
    <div class="dashboard-main borderBox">
      <h2>Wyszukaj wydarzenie</h2>
      <form @submit.prevent="searchEvents" class="search-bar">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Wyszukaj wydarzenie po nazwie"
          class="smallBorderBox"
        />
        <button type="submit" class="smallButton">Szukaj</button>
      </form>

      <h2>Lista wydarzeń</h2>

      <ul v-if="events.length > 0" class="event-list">
        <li v-for="event in events" :key="event.id" class="event-item">
          <h3 class="event-name">{{ event.name }}</h3>
          <p><strong>Lokalizacja:</strong> {{ event.location }}</p>
          <p><strong>Opis:</strong> {{ event.description }}</p>
          <p><strong>Data:</strong> {{ formatDate(event.startDate) }} - {{ formatDate(event.endDate) }}</p>
          <div class="event-actions">
            <button @click="goToEvent(event.id)">Więcej</button>
          </div>
        </li>
      </ul>
      <p v-else>Brak wydarzeń</p>
    </div>
  </div>
</template>

<script>
import NavBarComponent from './NavBarComponent.vue'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'dashboard-container',
  components: {
    NavBarComponent
  },
  setup() {
    const router = useRouter()
    const allEvents = ref([])
    const searchQuery = ref('')

    const events = computed(() => {
      const query = searchQuery.value.trim().toLowerCase()
      if (!query) return allEvents.value
      return allEvents.value.filter(event =>
        event.name.toLowerCase().includes(query)
      )
    })

    const formatDate = (dateStr) => {
      const date = new Date(dateStr)
      return date.toLocaleString('pl-PL', {
        dateStyle: 'short',
        timeStyle: 'short'
      })
    }

    const goToEvent = (eventId) => {
      router.push(`event/${eventId}`)
    }

    const fetchAllEvents = async () => {
      const res = await fetch(import.meta.env.VITE_API_URL + '/events/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })

      if (res.ok) {
        const data = await res.json()
        allEvents.value = data.filter(event => event.isVisible)
      } else {
        console.error('Błąd pobierania wydarzeń')
      }
    }

    const verifyAuth = async () => {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        router.push('/logowanie')
        return false
      }

      const verifyRes = await fetch(import.meta.env.VITE_API_URL + '/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'access', token: accessToken })
      })

      const verifyData = await verifyRes.json()
      if (!verifyData.isValid) {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
          router.push('/logowanie')
          return false
        }

        const refreshVerify = await fetch(import.meta.env.VITE_API_URL + '/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'REFRESH', token: refreshToken })
        })

        const refreshData = await refreshVerify.json()
        if (!refreshData.isValid) {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          router.push('/logowanie')
          return false
        }

        const newTokenRes = await fetch(import.meta.env.VITE_API_URL + '/auth/token', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${refreshToken}`
          }
        })

        const tokenData = await newTokenRes.json()
        if (!newTokenRes.ok || !tokenData.access) {
          router.push('/logowanie')
          return false
        }

        //localStorage.setItem('accessToken', tokenData.access)
      }

      return true
    }

    const searchEvents = () => {
      // Nic nie robimy – filtrowanie odbywa się przez computed `events`
    }

    onMounted(async () => {
      const isValid = await verifyAuth()
      if (isValid) {
        await fetchAllEvents()
      }
    })

    return {
      events,
      searchQuery,
      formatDate,
      goToEvent,
      searchEvents
    }
  }
}
</script>


<style scoped>

</style>

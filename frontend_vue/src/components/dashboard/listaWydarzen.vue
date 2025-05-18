<template>
  <div class="dashboard-container">
    <NavBarComponent />
    <div class="dashboard-main borderBox">
      <h2>Lista wydarzeń</h2>
      <ul v-if="events.length > 0" class="event-list">
        <li v-for="event in events" :key="event.id" class="event-item">
          <h3 class="event-name">{{ event.name }}</h3>
          <p><strong>Lokalizacja:</strong> {{ event.location }}, {{ event.locationDetails }}</p>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'dashboard-container',
  components: {
    NavBarComponent
  },
  setup() {
    const router = useRouter()
    const events = ref([])

    const formatDate = (dateStr) => {
      const date = new Date(dateStr)
      return date.toLocaleString('pl-PL', {
        dateStyle: 'short',
        timeStyle: 'short'
      })
    }

    const goToEvent = (eventId) => {
      // nawigacja do podstrony wydarzenia
      router.push(`event/${eventId}`)
    }

    onMounted(async () => {
      const accessToken = localStorage.getItem('accessToken')

      if (!accessToken) {
        router.push('/logowanie')
        return
      }

      const verifyRes = await fetch(import.meta.env.VITE_API_URL + '/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: 'access', token: accessToken })
      })

      const verifyData = await verifyRes.json()

      if (!verifyData.isValid) {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
          router.push('/logowanie')
          return
        }

        const refreshRes = await fetch(import.meta.env.VITE_API_URL + '/auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ type: 'REFRESH', token: refreshToken })
        })

        const refreshData = await refreshRes.json()
        if (!refreshData.isValid) {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          router.push('/logowanie')
          return
        }

        const tokenRes = await fetch(import.meta.env.VITE_API_URL + '/auth/token', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${refreshToken}`
          }
        })

        const tokenData = await tokenRes.json()
        if (!tokenRes.ok || !tokenData.access) {
          router.push('/logowanie')
          return
        }

        localStorage.setItem('accessToken', tokenData.access)
      }

      const eventsRes = await fetch(import.meta.env.VITE_API_URL + '/events/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })

      if (eventsRes.ok) {
        events.value = await eventsRes.json()
      } else {
        console.error('Błąd pobierania wydarzeń')
      }
    })

    return {
      events,
      formatDate,
      goToEvent
    }
  }
}
</script>

<style src="../../assets/dashboard.css" scoped>

</style>

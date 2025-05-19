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
        <li
          v-for="event in events"
          :key="event.id"
          class="event-item"
          :class="getStatusClass(event)"
        >
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

        const now = new Date()
        events.value = data.sort((a, b) => {
          return getStatusValue(a, now) - getStatusValue(b, now)
        })
      } catch (error) {
        console.error(error)
      }
    }

    const getStatus = (event) => {
      const now = new Date()
      const start = new Date(event.startDate)
      const end = new Date(event.endDate)

      if (now >= start && now <= end) return 'W trakcie'
      if (now < start) return 'Nadchodzące'
      return 'Zakończone'
    }

    const getStatusValue = (event, now = new Date()) => {
      const start = new Date(event.startDate)
      const end = new Date(event.endDate)

      if (now >= start && now <= end) return 1 // W trakcie
      if (now < start) return 2                // Nadchodzące
      return 3                                 // Zakończone
    }

    const getStatusClass = (event) => {
      const status = getStatus(event)
      if (status === 'W trakcie') return 'event-ongoing'
      if (status === 'Nadchodzące') return 'event-upcoming'
      return 'event-finished'
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
      getStatusValue,
      getStatusClass,
      goToPreview,
      goToEdit
    }
  }
}
</script>

<style scoped>
.event-list {
  list-style: none;
  padding: 0;
  margin-top: 1rem;
}

.event-item {
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  transition: background 0.3s;
}

.event-name {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.event-status {
  font-style: italic;
  margin-bottom: 0.5rem;
}

/* Kolory statusów */
.event-ongoing {
  background-color: #d4f4d1;
  color: #1c662f;
}

.event-upcoming {
  background-color: #f8f8f8;
  color: #000000;
}

.event-finished {
  background-color: #e0e0e0;
  color: #666666;
}

.event-actions button {
  margin-right: 0.5rem;
}

.event-name,
.event-status,
.event-actions {
  background: transparent;

}

</style>

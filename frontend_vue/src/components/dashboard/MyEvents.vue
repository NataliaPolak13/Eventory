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
          <div class="event-status">Status: <br>{{ getStatus(event) }}</div>
          <div class="event-joinability">
            Możliwość dołączenia: <br>{{ joinability[event.id] ?? '...' }}
          </div>
          <div class="event-actions">
            <button @click="goToPreview(event.id)">Podgląd</button>
            <button @click="goToEdit(event.id)">Edytuj</button>
          </div>
        </li>
      </ul>
      <p v-else>Brak wydarzeń</p>

      <h2>Wydarzenia, w których jesteś uczestnikiem</h2>
        <ul v-if="joinedEvents.length > 0" class="event-list">
          <li
            v-for="event in joinedEvents"
            :key="event.id"
            class="event-item"
            :class="getStatusClass(event)"
          >
            <div class="event-name">{{ event.name }}</div>
            <div class="event-status">Status: <br>{{ getStatus(event) }}</div>
            <div class="event-joinability">
              Możliwość dołączenia: <br>{{ joinability[event.id] ?? '...' }}
            </div>
            <div class="event-actions">
              <button @click="goToPreview(event.id)">Podgląd</button>
            </div>
          </li>
        </ul>
        <p v-else>Brak wydarzeń, w których uczestniczysz</p>

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
    const joinedEvents = ref([])
    const joinability = ref({})

    const fetchMyEvents = async (token) => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL + '/events/me/', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('Błąd podczas pobierania wydarzeń użytkownika')
        const data = await res.json()
        const now = new Date()
        events.value = data.sort((a, b) => getStatusValue(a, now) - getStatusValue(b, now))
        for (const event of data) {
          checkJoinability(token, event.id)
        }
      } catch (error) {
        console.error(error)
      }
    }

    const fetchJoinedEvents = async (token) => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL + '/events/joined', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('Błąd przy pobieraniu joined events')
        const joinedData = await res.json()

        const fetchedEvents = []

        for (const item of joinedData) {
          const strategyId = item.strategy.id

          try {
            const strategyRes = await fetch(`${import.meta.env.VITE_API_URL}/events/participate/strategy/open/${strategyId}`, {
              headers: { Authorization: `Bearer ${token}` }
            })

            if (!strategyRes.ok) {
              console.warn(`Nie udało się pobrać strategii o ID ${strategyId}`)
              continue
            }

            const strategy = await strategyRes.json()
            const event = strategy.event
            if (event) {
              fetchedEvents.push(event)
              checkJoinability(token, event.id)
            }
          } catch (strategyError) {
            console.error('Błąd przy pobieraniu strategii:', strategyError)
          }
        }

        const now = new Date()
        joinedEvents.value = fetchedEvents.sort((a, b) => getStatusValue(a, now) - getStatusValue(b, now))
      } catch (e) {
        console.error(e)
      }
    }

    const checkJoinability = async (token, eventId) => {
      try {
        const res1 = await fetch(`${import.meta.env.VITE_API_URL}/events/${eventId}/strategies`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (!res1.ok) throw new Error(`Błąd przy pobieraniu strategies: ${res1.status}`)
        const participantsData = await res1.json()

        if (!participantsData || participantsData.length === 0) {
          joinability.value[eventId] = 'Zamknięte'
          return
        }

        const strategyId = participantsData[0].id
        const res2 = await fetch(`${import.meta.env.VITE_API_URL}/events/participate/strategy/open/${strategyId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (res2.status === 404 || !res2.ok) {
          joinability.value[eventId] = 'Zamknięte'
          return
        }

        const strategy = await res2.json()
        const isJoinable = strategy.isDeleted === false && strategy.isOngoing === true
        joinability.value[eventId] = isJoinable ? 'Otwarte' : 'Zamknięte'
      } catch (e) {
        console.error('Błąd przy sprawdzaniu możliwości dołączenia:', e)
        joinability.value[eventId] = 'Zamknięte'
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
      if (now >= start && now <= end) return 1
      if (now < start) return 2
      return 3
    }

    const getStatusClass = (event) => {
      const status = getStatus(event)
      if (status === 'W trakcie') return 'event-ongoing'
      if (status === 'Nadchodzące') return 'event-upcoming'
      return 'event-finished'
    }

    const goToPreview = (id) => router.push(`/dashboard/event/${id}`)
    const goToEdit = (id) => router.push(`/dashboard/editEvent/${id}`)
    const goToEventFromStrategy = (strategyId) => router.push(`/dashboard/event/strategy/${strategyId}`)

    onMounted(async () => {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) return router.push('/logowanie')

      const verifyRes = await fetch(import.meta.env.VITE_API_URL + '/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'access', token: accessToken })
      })
      const verifyData = await verifyRes.json()
      if (!verifyData.isValid) return router.push('/logowanie')

      await fetchMyEvents(accessToken)
      await fetchJoinedEvents(accessToken)
    })

    return {
      events,
      joinedEvents,
      getStatus,
      getStatusValue,
      getStatusClass,
      joinability,
      goToPreview,
      goToEdit,
      goToEventFromStrategy
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

.event-status,
.event-joinability {
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
.event-joinability,
.event-actions {
  background: transparent;
}
</style>

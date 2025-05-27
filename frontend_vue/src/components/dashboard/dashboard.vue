<template>
    <div class="dashboard-container">
        <NavBarComponent />
        <div class="dashboard-main borderBox">
          <h1>Witaj, {{ user.fullName }}!</h1>

          <!-- Lista Wydarzeń -->
    <div class="section">
      <h2>Lista Wydarzeń</h2>
      <p>
        W tej sekcji możesz przeglądać wszystkie dostępne wydarzenia. Po zapoznaniu się ze szczegółami danego wydarzenia, 
        możesz do niego dołączyć jako uczestnik. To dobre miejsce, by znaleźć interesujące Cię strategie i scenariusze.
      </p>
    </div>

    <!-- Twoje Wydarzenia -->
    <div class="section">
      <h2>Twoje Wydarzenia</h2>
      <p>
        Ta sekcja pozwala Ci zarządzać wydarzeniami, w których już bierzesz udział. Możesz tutaj:
      </p>
      <h3>Dla event crateors:</h3>
      <ul>
        <li>Tworzyć nowe wydarzenia,</li>
        <li>Edytować istniejące,</li>
      </ul>
      <h3>Dla wszystkich:</h3>
      <ul>
        <li>Przeglądać szczegóły wydarzeń, których jesteś członkiem.</li>
      </ul>
    </div>

    <!-- O mnie -->
    <div class="section">
      <h2>O mnie</h2>
      <p>
        Tutaj możesz zobaczyć swoje dane użytkownika, takie jak imię, adres e-mail, rola w systemie lub inne informacje powiązane z Twoim kontem.
        To miejsce do szybkiego sprawdzenia, kim jesteś w systemie.
      </p>
    </div>
          
          <div v-if="upcomingEvent" class="upcoming-event">
            <h2>Twoje nadchodzące wydarzenie:</h2>
            <div class="event-card" @click="goToEvent(upcomingEvent.id)">
              <h3>{{ upcomingEvent.name }}</h3>
              <p><strong>Lokalizacja:</strong> {{ upcomingEvent.location }}</p>
              <p><strong>Data rozpoczęcia:</strong> {{ formatDate(upcomingEvent.startDate) }}</p>
              <p><strong>Data zakończenia:</strong> {{ formatDate(upcomingEvent.endDate) }}</p>
              <p>{{ upcomingEvent.description }}</p>
            </div>
          </div>
          
          <div v-else>
            <p>Brak aktualnego wydarzenia</p>
          </div>
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
    const user = ref({})
    const upcomingEvent = ref(null)
    const events = ref([])

    const formatDate = (dateStr) => {
      const date = new Date(dateStr)
      return date.toLocaleString('pl-PL', {
        dateStyle: 'short',
        timeStyle: 'short'
      })
    }

    const goToEvent = (eventId) => {
      router.push(`/events/${eventId}`)
    }

    const fetchUserData = async () => {
      const res = await fetch(import.meta.env.VITE_API_URL + '/users/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      if (res.ok) {
        user.value = await res.json()
      }
    }

    const findUpcomingEvent = async () => {
      // Pobierz wydarzenia, w których użytkownik uczestniczy
      const joinedRes = await fetch(import.meta.env.VITE_API_URL + '/events/joined', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      
      if (!joinedRes.ok) return
      
      const joinedEvents = await joinedRes.json()
      
      // Filtruj tylko aktywne wydarzenia (nieusunięte)
      const activeEvents = joinedEvents.filter(event => 
        !event.strategy.isDeleted && 
        !event.strategy.isDeletedEvent &&
        event.strategy.isVisible
      )
      
      if (activeEvents.length === 0) return
      
      // Znajdź najbliższe wydarzenie (najwcześniejsza startDate)
      const now = new Date()
      let closestEvent = null
      let closestDateDiff = Infinity
      
      for (const event of activeEvents) {
        const eventDate = new Date(event.strategy.startDate)
        if (eventDate < now) continue // pomiń przeszłe wydarzenia
        
        const diff = eventDate - now
        if (diff < closestDateDiff) {
          closestDateDiff = diff
          closestEvent = event
        }
      }
      
      if (!closestEvent) return
      
      // Pobierz szczegóły wydarzenia
      const eventRes = await fetch(
        `${import.meta.env.VITE_API_URL}/events/participate/strategy/open/${closestEvent.strategy.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      )
      
      if (eventRes.ok) {
        const eventData = await eventRes.json()
        upcomingEvent.value = eventData.event
      }
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

      await fetchUserData()
      await findUpcomingEvent()
    })

    return {
      user,
      upcomingEvent,
      events,
      formatDate,
      goToEvent
    }
  }
}
</script>

<style src="../../assets/dashboard.css" scoped>
</style>

<style scoped>
.upcoming-event {
  margin-top: 2rem;
}

.event-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.event-card:hover {
  background-color: #f5f5f5;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.event-card h3 {
  margin-top: 0;
  color: #2c3e50;
}

.event-card p {
  margin: 0.5rem 0;
}
</style>
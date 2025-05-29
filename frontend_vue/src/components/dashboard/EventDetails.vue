<template>
  <div class="dashboard-container">
    <NavBarComponent />
    <div class="dashboard-main borderBox">
      <h2>Szczegóły wydarzenia</h2>

      <div v-if="event">
        <h3>{{ event.name }}</h3>
        <p><strong>Opis:</strong> {{ event.description }}</p>
        <p><strong>Lokalizacja:</strong> {{ event.location }} - {{ event.locationDetails }}</p>
        <p><strong>Data rozpoczęcia:</strong> {{ formatDate(event.startDate) }}</p>
        <p><strong>Data zakończenia:</strong> {{ formatDate(event.endDate) }}</p>
        <p><strong>Utworzone przez:</strong> {{ event.createdBy.fullName }} ({{ event.createdBy.username }})</p>

        <div v-if="joinable === null">
          <p>Sprawdzanie dostępności zapisów...</p>
        </div>
        <div v-else-if="joinable === false">
          <p><strong>Zapisy:</strong> Zamknięte</p>
        </div>
        <div v-else>
          <p><strong>Zapisy:</strong> Otwarte</p>
          <button v-if="isParticipant" @click="unregister">Wypisz się</button>
          <button v-else @click="register">Zapisz się</button>

          <div v-if="participantsList.length">
            <h4>Uczestnicy:</h4>
            <ul>
              <li v-for="u in participantsList" :key="u.id">
                {{ u.fullName }} ({{ u.username }})
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div v-else>
        <p>Ładowanie danych wydarzenia...</p>
      </div>
    </div>
  </div>
</template>

<script>
import NavBarComponent from './NavBarComponent.vue'
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'EventDetails',
  components: { NavBarComponent },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const event = ref(null)
    const joinable = ref(null)
    const strategyId = ref(null)
    const isParticipant = ref(false)
    const participationId = ref(null)
    const participantsList = ref([])

    const formatDate = (dateStr) => new Date(dateStr).toLocaleString('pl-PL')

    const fetchEventDetails = async (id, token) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Błąd pobierania danych wydarzenia')
      event.value = await res.json()
    }

    const checkJoinability = async (eventId, token) => {
      try {
        const res1 = await fetch(`${import.meta.env.VITE_API_URL}/events/${eventId}/strategies`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const participantsData = await res1.json()
        if (!participantsData || participantsData.length === 0) {
          joinable.value = false
          return
        }
        strategyId.value = participantsData[0].id

        const res2 = await fetch(`${import.meta.env.VITE_API_URL}/events/participate/strategy/open/${strategyId.value}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (res2.status === 404 || !res2.ok) {
          joinable.value = false
          return
        }

        const strategy = await res2.json()
        joinable.value = !strategy.isDeleted && strategy.isOngoing
      } catch {
        joinable.value = false
      }
    }

    const checkParticipation = async (strategyIdToFind, token) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/events/joined`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      const match = data.find(entry => entry.strategy.id === strategyIdToFind)
      if (match) {
        isParticipant.value = true
        participationId.value = match.id
      }
    }

    const fetchParticipants = async (eventId, token) => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/events/${eventId}/participants`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('Błąd pobierania uczestników')

        const data = await res.json()
        const openBlock = data.find(d => d.strategyType === 'open')
        if (openBlock) {
          participantsList.value = openBlock.list
            .flatMap(item => item.participants)
            .map(p => p.user)
        }
      } catch (e) {
        console.error(e)
        participantsList.value = []
      }
      console.log('Participants fetched:', participantsList.value)
    }

    const register = async () => {
      const token = localStorage.getItem('accessToken')
      const res = await fetch(`${import.meta.env.VITE_API_URL}/events/participate/strategy/open/${strategyId.value}/participants`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        isParticipant.value = true
        await checkParticipation(strategyId.value, token)
        await fetchParticipants(route.params.id, token)
      } else {
        alert('Nie udało się zapisać.')
      }
    }

    const unregister = async () => {
      const token = localStorage.getItem('accessToken')
      const res = await fetch(`${import.meta.env.VITE_API_URL}/events/participate/strategy/open/participation/${participationId.value}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        isParticipant.value = false
        participationId.value = null
        await fetchParticipants(route.params.id, token)
      } else {
        alert('Nie udało się wypisać.')
      }
    }

    onMounted(async () => {
      const token = localStorage.getItem('accessToken')
      if (!token) return router.push('/logowanie')

      const verifyRes = await fetch(import.meta.env.VITE_API_URL + '/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'access', token })
      })
      const verifyData = await verifyRes.json()
      if (!verifyData.isValid) return router.push('/logowanie')

      const eventId = route.params.id
      await fetchEventDetails(eventId, token)
      await checkJoinability(eventId, token)
      if (strategyId.value) {
        await checkParticipation(strategyId.value, token)
        await fetchParticipants(eventId, token)
      } else {
        await fetchParticipants(eventId, token)
      }
    })

    return {
      event,
      formatDate,
      joinable,
      isParticipant,
      register,
      unregister,
      participantsList
    }
  }
}
</script>

<style scoped>
h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}
h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}
h4 {
  font-size: 1.25rem;
  margin-top: 1.5rem;
}
p {
  margin: 0.5rem 0;
}
button {
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
ul {
  list-style: disc;
  margin-left: 1.5rem;
}
</style>

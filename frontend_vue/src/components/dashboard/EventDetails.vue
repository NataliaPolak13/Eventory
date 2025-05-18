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
  components: {
    NavBarComponent
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const event = ref(null)

    const fetchEventDetails = async (id, token) => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/events/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!res.ok) throw new Error('Błąd pobierania danych wydarzenia')
        const data = await res.json()
        event.value = data
      } catch (error) {
        console.error(error)
      }
    }

    const formatDate = (dateStr) => new Date(dateStr).toLocaleString('pl-PL')

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

      const eventId = route.params.id
      await fetchEventDetails(eventId, accessToken)
    })

    return {
      event,
      formatDate
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
p {
  margin: 0.5rem 0;
}
</style>

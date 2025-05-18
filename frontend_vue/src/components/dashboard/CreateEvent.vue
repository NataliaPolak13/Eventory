<template>
  <div class="dashboard-container">
    <NavBarComponent />
    <div class="dashboard-main borderBox">
      <h2>Utwórz nowe wydarzenie</h2>
      <form class="event-form" @submit.prevent="submitEvent">
        <label>Nazwa wydarzenia:
          <input v-model="event.name" required />
        </label>

        <label>Opis:
          <textarea v-model="event.description" required></textarea>
        </label>

        <label>Lokalizacja:
          <input v-model="event.location" required />
        </label>

        <label>Szczegóły lokalizacji:
          <input v-model="event.locationDetails" />
        </label>

        <label>Data rozpoczęcia:
          <input type="datetime-local" v-model="event.startDate" required />
        </label>

        <label>Data zakończenia:
          <input type="datetime-local" v-model="event.endDate" required />
        </label>

        <label>Widoczność od:
          <input type="datetime-local" v-model="event.visibleFrom" required />
        </label>

        <label>Widoczność do:
          <input type="datetime-local" v-model="event.visibleUntil" required />
        </label>

        <button type="submit">Utwórz wydarzenie</button>
      </form>
    </div>
  </div>
</template>

<script>
import NavBarComponent from './NavBarComponent.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'CreateEvent',
  components: { NavBarComponent },
  setup() {
    const router = useRouter()

    const event = ref({
      name: '',
      description: '',
      location: '',
      locationDetails: '',
      startDate: '',
      endDate: '',
      visibleFrom: '',
      visibleUntil: ''
    })

    const checkAuth = async () => {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        router.push('/logowanie')
        return false
      }

      const res = await fetch(import.meta.env.VITE_API_URL + '/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'access', token: accessToken })
      })

      const data = await res.json()
      if (!data.isValid) {
        router.push('/logowanie')
        return false
      }

      return true
    }

    const submitEvent = async () => {
      const isAuth = await checkAuth()
      if (!isAuth) return

      const payload = {
        name: event.value.name,
        description: event.value.description,
        location: event.value.location,
        locationDetails: event.value.locationDetails,
        startDate: new Date(event.value.startDate).toISOString(),
        endDate: new Date(event.value.endDate).toISOString(),
        visibleFrom: new Date(event.value.visibleFrom).toISOString(),
        visibleUntil: new Date(event.value.visibleUntil).toISOString()
      }

      const response = await fetch(import.meta.env.VITE_API_URL + '/events/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        router.push('/dashboard/myEvents')
      } else {
        alert('Błąd przy tworzeniu wydarzenia')
      }
    }

    onMounted(checkAuth)

    return {
      event,
      submitEvent
    }
  }
}
</script>

<style scoped>
.event-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 600px;
  margin-top: 1rem;
}

.event-form label {
  display: flex;
  flex-direction: column;
  font-weight: bold;
}

.event-form input,
.event-form textarea {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.event-form button {
  width: fit-content;
  padding: 0.6rem 1.2rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.event-form button:hover {
  background-color: #1e40af;
}
</style>

<template>
  <div class="dashboard-container">
    <NavBarComponent />
    <div class="dashboard-main borderBox">
      <h2>Edytuj wydarzenie</h2>

      <form @submit.prevent="submitUpdate">
        <label>Nazwa</label>
        <input v-model="event.name" type="text" class="smallBorderBox" required />

        <label>Opis</label>
        <textarea v-model="event.description" class="smallBorderBox" required></textarea>

        <label>Główna lokalizacja</label>
        <input v-model="event.location" type="text" class="smallBorderBox" required />

        <label>Szczegóły lokalizacji</label>
        <input v-model="event.locationDetails" type="text" class="smallBorderBox" required />

        <label>Data rozpoczęcia</label>
        <input v-model="event.startDate" type="datetime-local" class="smallBorderBox" required />

        <label>Data zakończenia</label>
        <input v-model="event.endDate" type="datetime-local" class="smallBorderBox" required />

        <label>Widoczność od</label>
        <input v-model="event.visibilityStartDate" type="datetime-local" class="smallBorderBox" required />

        <label>Widoczność do</label>
        <input v-model="event.visibilityEndDate" type="datetime-local" class="smallBorderBox" required />

        <button type="submit" class="smallButton">Zapisz zmiany</button>
      </form>

      <hr />

      <div>
        <h3>Usuń wydarzenie</h3>
        <input v-model="deleteReason" type="text" placeholder="Powód usunięcia" class="smallBorderBox" />
        <button @click="deleteEvent" class="dangerButton">Usuń wydarzenie</button>
      </div>
    </div>
  </div>
</template>

<script>
import NavBarComponent from './NavBarComponent.vue'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'EditEventView',
  components: {
    NavBarComponent
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const event = ref({
      name: '',
      description: '',
      location: '',
      locationDetails: '',
      startDate: '',
      endDate: '',
      visibilityStartDate: '',
      visibilityEndDate: ''
    })
    const deleteReason = ref('')

    const fetchEvent = async () => {
      const res = await fetch(import.meta.env.VITE_API_URL + `/events/${route.params.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })

      if (res.ok) {
        const data = await res.json()
        event.value = {
          name: data.name,
          description: data.description,
          location: data.location,
          locationDetails: data.locationDetails,
          startDate: data.startDate.slice(0, 16),
          endDate: data.endDate.slice(0, 16),
          visibilityStartDate: data.visibilityStartDate.slice(0, 16),
          visibilityEndDate: data.visibilityEndDate.slice(0, 16)
        }
      } else {
        console.error('Nie udało się pobrać wydarzenia')
      }
    }

    const submitUpdate = async () => {
      const res = await fetch(import.meta.env.VITE_API_URL + `/events/${route.params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(event.value)
      })

      if (res.ok) {
        alert('Zaktualizowano wydarzenie')
        router.push('/dashboard/myEvents')
      } else {
        alert('Błąd podczas aktualizacji')
      }
    }

    const deleteEvent = async () => {
      if (!deleteReason.value.trim()) {
        alert('Podaj powód usunięcia')
        return
      }

      const res = await fetch(import.meta.env.VITE_API_URL + `/events/${route.params.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ reason: deleteReason.value })
      })

      if (res.ok) {
        alert('Wydarzenie usunięte')
        router.push('/dashboard/myEvents')
      } else {
        alert('Nie udało się usunąć wydarzenia')
      }
    }

    onMounted(() => {
      fetchEvent()
    })

    return {
      event,
      deleteReason,
      submitUpdate,
      deleteEvent
    }
  }
}
</script>

<style scoped>
label {
  display: block;
  margin-top: 1rem;
}
textarea {
  width: 100%;
  min-height: 80px;
}
.dangerButton {
  background-color: #c62828;
  color: white;
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
  border: none;
  border-radius: 4px;
}
</style>

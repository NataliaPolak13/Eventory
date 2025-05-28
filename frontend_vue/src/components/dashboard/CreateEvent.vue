<template>
  <div class="dashboard-container">
    <NavBarComponent />
    <div class="dashboard-main borderBox">
      <h2>Utwórz nowe wydarzenie</h2>

      <!-- Wyświetlanie błędu -->
      <div v-if="errorMessage" class="error-box">
        {{ errorMessage }}
      </div>

      <form v-if="hasPermission" class="event-form" @submit.prevent="submitEvent">
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

    const errorMessage = ref('')
    const hasPermission = ref(false)

    const checkAuthAndRoles = async () => {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        router.push('/logowanie')
        return
      }

      // Sprawdzenie poprawności tokenu
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

      // Pobranie ról
      const rolesRes = await fetch(import.meta.env.VITE_API_URL + '/roles/me', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      if (!rolesRes.ok) {
        errorMessage.value = 'Błąd podczas pobierania ról.'
        return
      }

      const roles = await rolesRes.json()
      const roleNames = roles.map(r => r.name)
      if (roleNames.includes('admin') || roleNames.includes('event_creator')) {
        hasPermission.value = true
      } else {
        errorMessage.value = 'Brak odpowiedniej roli do tworzenia wydarzeń.'
      }
    }

    const submitEvent = async () => {
      errorMessage.value = ''
      if (!hasPermission.value) {
        errorMessage.value = 'Brak odpowiedniej roli do tworzenia wydarzeń.'
        return
      }

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

      try {
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
          const errorData = await response.json()
          errorMessage.value = errorData.message || 'Wystąpił błąd przy tworzeniu wydarzenia.'
        }
      } catch (e) {
        console.error(e)
        errorMessage.value = 'Nie udało się połączyć z serwerem.'
      }
    }

    onMounted(checkAuthAndRoles)

    return {
      event,
      submitEvent,
      errorMessage,
      hasPermission
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
  background-color: #216464;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.event-form button:hover {
  background-color: rgb(22, 66, 66);
}

.error-box {
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #a94442;
  background-color: #f2dede;
  color: #a94442;
  border-radius: 6px;
}
</style>

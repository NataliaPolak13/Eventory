<template>
  <div class="borderBox admin-panel" style="padding: 30px;">
    <h1>Admin panel</h1>
    <p v-if="loading">Ładowanie...</p>
    <p v-if="error">{{ error }}</p>

    <div v-if="!loading && !error">
      <h2>Lista użytkowników</h2>
      <ul class="user-list">
        <li v-for="user in users" :key="user.id" class="user-item">
          <div class="user-item-content">
            <div class="user-data">
                <strong>użytkownik:</strong> {{ user.fullName }} <strong>Username: </strong> {{ user.username }}
            </div>
            <div>
              <button class="smallButton del" v-if="hasRole(user.id, 'user')" @click="changeRole(user.id, 'user', 'remove')">Odbierz rolę user</button>
              <button class="smallButton" v-else @click="changeRole(user.id, 'user', 'add')">Dodaj rolę user</button>

              <button class="smallButton del" v-if="hasRole(user.id, 'event_creator')" @click="changeRole(user.id, 'event_creator', 'remove')">Odbierz rolę event_creator</button>
              <button class="smallButton" v-else @click="changeRole(user.id, 'event_creator', 'add')">Dodaj rolę event_creator</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'AdminPanel',
  setup() {
    const router = useRouter()
    const loading = ref(true)
    const error = ref(null)
    const users = ref([])
    const userRoles = ref({})

    const hasRole = (userId, roleName) => {
      return userRoles.value[userId]?.some(r => r.name === roleName)
    }

    const fetchUsers = async (token) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Błąd przy pobieraniu użytkowników')
      const data = await res.json()
      users.value = data

      for (const user of data) {
        const roleRes = await fetch(`${import.meta.env.VITE_API_URL}/roles/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!roleRes.ok) {
          userRoles.value[user.id] = []
        } else {
          userRoles.value[user.id] = await roleRes.json()
        }
      }
    }

    const changeRole = async (userId, roleName, action) => {
      const token = localStorage.getItem('accessToken')
      let url = `${import.meta.env.VITE_API_URL}/roles/${roleName}/users/${userId}`
      const options = {
        method: action === 'add' ? 'POST' : 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      }
      if (action === 'add') url += '?confirm=true'

      console.log(`Wysyłanie żądania: ${options.method} ${url}`)

      try {
        const res = await fetch(url, options)
        if (!res.ok) throw new Error('Nie udało się zmienić roli')
        // Aktualizacja ról po zmianie
        const roleRes = await fetch(`${import.meta.env.VITE_API_URL}/roles/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        userRoles.value[userId] = roleRes.ok ? await roleRes.json() : []
      } catch (e) {
        console.error(e)
        alert('Nie udało się zmienić roli: ' + e.message)
      }
    }

    const verifyAndCheckAdmin = async () => {
      const token = localStorage.getItem('accessToken')
      if (!token) return router.push('/logowanie')

      try {
        const verifyRes = await fetch(import.meta.env.VITE_API_URL + '/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'access', token })
        })
        const verifyData = await verifyRes.json()
        if (!verifyData.isValid) return router.push('/logowanie')

        const rolesRes = await fetch(import.meta.env.VITE_API_URL + '/roles/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!rolesRes.ok) throw new Error('Błąd przy pobieraniu ról.')

        const roles = await rolesRes.json()
        const isAdmin = roles.some(role => role.name === 'admin')

        if (!isAdmin) {
          error.value = 'Nie masz uprawnień do wyświetlenia tej strony.'
          return
        }

        await fetchUsers(token)
      } catch (err) {
        error.value = err.message || 'Wystąpił błąd.'
      } finally {
        loading.value = false
      }
    }

    onMounted(() => verifyAndCheckAdmin())

    return {
      loading,
      error,
      users,
      userRoles,
      hasRole,
      changeRole
    }
  }
}
</script>

<style src="../../assets/dashboard.css" scoped>
</style>
<template>
    <div class="dashboard-container">
        <NavBarComponent />
        <div class="dashboard-main borderBox">
            <!-- Zawartość tu -->
            
            <!--  do tu       -->
        </div>
    </div>
    
</template>

<script>
import NavBarComponent from './NavBarComponent.vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'dashboard-container',
  components: {
    NavBarComponent
  },
  setup() {
    const router = useRouter()

        //     localStorage.setItem("accessToken", data.accessToken);
        // localStorage.setItem("refreshToken", data.refreshToken);
        // localStorage.setItem("user", JSON.stringify(data.user));

    onMounted(async () => {
      const accessToken = localStorage.getItem('accessToken')

      if (!accessToken) {
        router.push('/logowanie')
        return
      }

      const res = await fetch(import.meta.env.VITE_API_URL + '/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'access',
          token: accessToken
        })
      })

      const data = await res.json()

      console.log(data)

      if (!data.isValid) {
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
          body: JSON.stringify({
            type: 'REFRESH',
            token: refreshToken
          })
        })

        const refreshData = await refreshRes.json()

        if (!refreshData.isValid) {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          router.push('/logowanie')
          return
        }

        // odnowa access token
        const tokenRes = await fetch(import.meta.env.VITE_API_URL + '/auth/token', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${refreshToken}`
          }
        })

        const tokenData = await tokenRes.json()

        if (!tokenRes.ok || !tokenData.access) {
          router.push('/logowanie')
          return
        }

        localStorage.setItem('accessToken', tokenData.access)
      }

      // Możesz tu teraz pobrać dane użytkownika lub inne zasoby
    })
  }
}
</script>

<style src="../../assets/dashboard.css" scoped>

</style>

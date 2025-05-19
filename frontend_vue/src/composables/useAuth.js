import { useRouter } from 'vue-router'

export function useAuth() {
  const router = useRouter()

  async function verifyToken() {
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
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        router.push('/logowanie')
        return false
      }

      const refreshRes = await fetch(import.meta.env.VITE_API_URL + '/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'REFRESH', token: refreshToken })
      })

      const refreshData = await refreshRes.json()
      if (!refreshData.isValid) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        router.push('/logowanie')
        return false
      }

      const tokenRes = await fetch(import.meta.env.VITE_API_URL + '/auth/token', {
        method: 'POST',
        headers: { Authorization: `Bearer ${refreshToken}` }
      })

      const tokenData = await tokenRes.json()
      if (!tokenRes.ok || !tokenData.access) {
        router.push('/logowanie')
        return false
      }

      localStorage.setItem('accessToken', tokenData.access)
    }

    return true
  }

  return { verifyToken }
}

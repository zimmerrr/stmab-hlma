import { LocalStorage } from 'quasar'
import { ref, watch } from 'vue'
import { useConfig } from 'src/components/backend/config'

const config = useConfig()

export interface User {
  firstName?: string,
  middleName?: string,
  lastName?: string
  employeeId?: string
  division?: string
  username?: string
  password?: string
  role?: string
}

export const userRole = ref<string | null>(LocalStorage.getItem('USER_ROLE') || '')
watch(userRole, (val) => { LocalStorage.set('USER_ROLE', val || '') })

export function useViewerUser() {
  async function viewUser() {
    try {
      const token = LocalStorage.getItem('AUTH_TOKEN')
      const response = await fetch(`${config.API_HOST}/users/myProfile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      userRole.value = data.role as any

      return data as User
    } catch (error) {
      console.error('Error occurred:', error)
    }
  }

  return { viewUser }
}

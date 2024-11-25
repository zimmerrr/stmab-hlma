import { LocalStorage } from 'quasar'
import { ref, watch } from 'vue'
import { useConfig } from 'src/components/backend/config'
import { useViewerUser } from 'src/components/backend/user'

const config = useConfig()

export interface Member {
  _id?: string,
  active?: boolean
}

export interface Course {
  _id?: string,
  username?: string,
  name?: string,
  description?: string
  Members?: Member[]
  active?: boolean
}

export async function viewCourses(active?: boolean, query?: string) {
  try {
    const token = LocalStorage.getItem('AUTH_TOKEN')
    const url = new URL(`${config.API_HOST}/courses`)
    if (query) {
      url.searchParams.append('query', query)
    }

    url.searchParams.append('active', active ? 'true' : 'false')

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()

    return data
  } catch (error) {
    console.error('Error occurred:', error)
  }
}

export async function addCourse(item: Course) {
  try {
    const token = LocalStorage.getItem('AUTH_TOKEN')
    const { viewUser } = useViewerUser()

    const user = await viewUser(token as string)
    const activeUser = user?.firstName + '' + user?.lastName
    const response = await fetch(`${config.API_HOST}/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...item,
        loggedBy: activeUser,
      }),

    })
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
  } catch (error) {
    console.error('Error occurred:', error)
  }
}

export async function updateCourse(course: Course) {
  try {
    const token = LocalStorage.getItem('AUTH_TOKEN')
    const response = await fetch(`${config.API_HOST}/courses/update/${course._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...course,
      }),
    })
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
  } catch (error) {
    console.error('Error occurred:', error)
  }
}

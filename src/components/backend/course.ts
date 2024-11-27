import { LocalStorage } from 'quasar'
import { ref, watch } from 'vue'
import { useConfig } from 'src/components/backend/config'
import { useViewerUser } from 'src/components/backend/user'

const config = useConfig()

export interface Activity {
  _id?: string,
  name?: string
  description?: string
  active?: boolean
  file?: File
}
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

export async function joinCourse(courseId: string, userId: string, name: string, group: string) {
  try {
    const token = LocalStorage.getItem('AUTH_TOKEN')
    const response = await fetch(`${config.API_HOST}/courses/member`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        courseId,
        userId,
        name,
        group,
      }),
    })
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
  } catch (error) {
    console.error('Error occurred:', error)
  }
}

export async function viewerCourses() {
  try {
    const token = LocalStorage.getItem('AUTH_TOKEN')

    const response = await fetch(`${config.API_HOST}/courses/viewer`, {
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

  }
}

export async function viewActivities(courseId: string) {
  try {
    const token = LocalStorage.getItem('AUTH_TOKEN')

    const response = await fetch(`${config.API_HOST}/courses/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        courseId,
      }),
    })
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()

    return data
  } catch (error) {

  }
}

export async function addActivity(courseId: string, activity: Activity) {
  try {
    const token = LocalStorage.getItem('AUTH_TOKEN')
    const formData = new FormData()

    formData.append('courseId', courseId)
    if (activity.name) formData.append('name', activity.name)
    if (activity.description) formData.append('description', activity.description)
    if (activity.active !== undefined) formData.append('active', String(activity.active))
    if (activity.file) formData.append('file', activity.file)

    const response = await fetch(`${config.API_HOST}/courses/activity`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
      },
      body:
        formData,

    })
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
  } catch (error) {
    console.error('Error occurred:', error)
  }
}

export async function updateActivity(courseId: string, activityId: string, activity: Activity) {
  try {
    const token = LocalStorage.getItem('AUTH_TOKEN')
    const response = await fetch(`${config.API_HOST}/courses/activity/${courseId}/${activityId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...activity,
      }),
    })
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
  } catch (error) {
    console.error('Error occurred:', error)
  }
}

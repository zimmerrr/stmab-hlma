<template>
  <q-page class="flex flex-center">
    <q-card
      style="width: 900px; max-width: 70vw;"
      class="q-pa-md"
    >
      <div
        v-if="course"
        class="text-h5 text-center text-uppercase"
      >
        <div>
          You are invited to join the
        </div>
        <div class="text-weight-bold">
          {{ course.name }} - {{ course.username }}
        </div>

        <div class="q-mt-md">
          <q-btn
            color="green"
            label="Join Course"
            :loading="loading"
            class="q-px-xl generic-button"
            @click="join()"
          />
        </div>
      </div>

      <div
        v-else
        class="text-center"
      >
        <q-spinner
          size="5rem"
          class="q-my-lg"
        />
      </div>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { type Course, viewCourses, joinCourse } from 'src/components/backend/course'
import { useRoute, useRouter } from 'vue-router'
import { useViewerUser } from 'src/components/backend/user'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const courseId = ref(route.params.course as string || '')
const course = ref<Course | null>(null)
async function fetchActivities() {
  try {
    loading.value = true
    const response = await viewCourses(true, courseId.value)
    course.value = response[0]
  } catch (error) {
    console.error('Error fetching Courses:', error)
  } finally {
    loading.value = false
  }
}
const { viewUser } = useViewerUser()
async function join() {
  try {
    loading.value = true
    const user = await viewUser()
    const name = user?.firstName + ' ' + user?.lastName
    if (user) {
      await joinCourse(courseId.value, user?._id as string, name, user?.group as string)
      router.replace(`/${courseId.value}`)
    }
  } finally {
    loading.value = false
  }
}
onMounted(() => {
  fetchActivities()
})
</script>

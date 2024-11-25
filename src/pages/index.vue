<template>
  <q-page
    class="flex flex-center"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useConfig } from 'src/components/backend/config'
import { useAuth } from 'src/components/backend/auth'
import { useViewerUser } from 'src/components/backend/user'
import { LocalStorage } from 'quasar'
import { useRouter } from 'vue-router'

const router = useRouter()
const { validateToken } = useAuth()
const { viewUser } = useViewerUser()

function isLoggedIn() {
  const token = LocalStorage.getItem('AUTH_TOKEN')
  if (!token) return
  const isValid = validateToken(token as string)

  return isValid
}
onMounted(async () => {
  if (isLoggedIn()) {
    const user = await viewUser()
    if (user?.role === 'admin') {
      router.replace('/admin/users')
    } else if (user?.role === 'employee') {
      router.replace('/courses')
    } else if (user?.role === 'student') {
      router.replace('/student/dashboard')
    }
  } else {
    router.replace('/login')
  }
})

onMounted(() => {

})
</script>

<style scoped lang="sass">

</style>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuth } from 'src/components/backend/auth'
import { LocalStorage } from 'quasar'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'MainLayout',
})

const router = useRouter()
const { validateToken } = useAuth()

function isLoggedIn() {
  const token = LocalStorage.getItem('AUTH_TOKEN')
  if (!token) return
  const isValid = validateToken(token as string)

  return isValid
}

onMounted(async () => {
  if (await isLoggedIn()) {
    router.replace('/')
  } else {
    router.replace('/login')
  }
})
</script>

<style lang="sass">
.q-layout
  background-color: $accent

.logo
  width: 300px

</style>

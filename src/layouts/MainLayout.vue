<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
      <q-header>
        <q-toolbar>
          <q-toolbar-title class="non-selectable">
            HLMA: Hybrid Learning Management Application
          </q-toolbar-title>

          <q-btn
            flat
            round
            dense
            label="logout"
            icon="logout"
            class="q-mr-sm"
            right-icon
            @click="router.replace('/logout')"
          />
        </q-toolbar>
      </q-header>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuth } from 'src/components/backend/auth'
import { useConfig } from 'src/components/backend/config'

import { LocalStorage } from 'quasar'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'MainLayout',
})

const config = useConfig()
console.log(config)
const router = useRouter()
const { validateToken } = useAuth()

const role = LocalStorage.getItem('USER_ROLE')
function isLoggedIn() {
  const token = LocalStorage.getItem('AUTH_TOKEN')
  if (!token) return
  const isValid = validateToken(token as string)

  return isValid
}

onMounted(async () => {
  if (await !isLoggedIn()) {
    if (role === 'admin') {
      router.replace('/admin/users')
    } else {
      router.replace('/')
    }
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

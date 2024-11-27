<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
      <q-header>
        <q-toolbar>
          <q-toolbar-title class="non-selectable">
            <span>
              HLMA
            </span>
            <span v-if="!$q.screen.xs">
              : Hybrid Learning Management Application
            </span>
          </q-toolbar-title>

          <q-btn
            v-if="!route.meta.login"
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

import { LocalStorage } from 'quasar'
import { useRouter, useRoute } from 'vue-router'

defineOptions({
  name: 'MainLayout',
})

const route = useRoute()
const router = useRouter()
const { validateToken } = useAuth()

const role = LocalStorage.getItem('USER_ROLE')
function isLoggedIn() {
  const token = LocalStorage.getItem('AUTH_TOKEN')
  if (!token) return false
  const isValid = validateToken(token as string)
  return isValid
}

onMounted(async () => {
  if (role !== '' || await isLoggedIn()) {
    if (role === 'admin') {
      router.replace('/admin/users')
    }
  } else {
    const nextUrl = route.path
    router.replace(`/login?next=${nextUrl}`)
  }
})
</script>

<style lang="sass">
.q-layout
  background-color: $accent

.logo
  width: 300px

</style>

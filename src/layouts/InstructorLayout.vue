<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-header>
        <q-toolbar>
          <q-btn
            flat
            round
            dense
            icon="menu"
            class="q-mr-sm"
            @click="menuToggle = !menuToggle"
          />

          <q-toolbar-title class="non-selectable">
            HLMA: Hybrid Learning Management Application
          </q-toolbar-title>
        </q-toolbar>

        <q-drawer
          v-model="menuToggle"
          elevated
          class="bg-accent"
        >
          <q-scroll-area class="fit non-selectable">
            <q-list class="q-mt-md">
              <template
                v-for="(item, idx) in MENU"
                :key="idx"
              >
                <q-item
                  v-ripple
                  clickable
                  class="text-primary"
                  @click="router.replace(item.to)"
                >
                  <q-item-section avatar>
                    <q-icon :name="item.icon" />
                  </q-item-section>
                  <q-item-section>
                    {{ item.label }}
                  </q-item-section>
                </q-item>
              </template>
            </q-list>
          </q-scroll-area>
        </q-drawer>
      </q-header>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuth } from 'src/components/backend/auth'
import { useConfig } from 'src/components/backend/config'

import { LocalStorage } from 'quasar'
import { useRouter } from 'vue-router'
const MENU = [
  {
    label: 'Course',
    key: 'course',
    icon: 'menu_book',
    to: '/admin/course',
  },
  {
    label: 'Logout',
    key: 'logout',
    icon: 'logout',
    to: '/logout',
  },
]

defineOptions({
  name: 'MainLayout',
})

const config = useConfig()
const menuToggle = ref(false)
console.log(config)
const router = useRouter()
const { validateToken } = useAuth()

function isLoggedIn() {
  const token = LocalStorage.getItem('AUTH_TOKEN')
  if (!token) return
  const isValid = validateToken(token as string)

  return isValid
}

onMounted(async () => {
  if (await !isLoggedIn()) {
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

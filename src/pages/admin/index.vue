<template>
  <q-page class="flex flex-center bg-primary">
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
          Admin
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
                :class="item.key === activeMenu.key? 'bg-primary text-white' : ''"
                @click="changeActiveMenu(item.label, item.key)"
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
    <div class="container">
      <div class="row text-center fit q-mx-auto">
        <div class="col-12 q-pa-md bg-secondary">
          <div class="bg-white card full-height q-pt-xs q-pb-md">
            <template v-if="activeMenu.key === 'student' || activeMenu.key ==='instructor'">
              <q-table
                :title="activeMenu.label"
                :rows="users"
                class="text-uppercase"
                :loading="loading"
                :columns="COLUMNS"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useLogin, useAuth } from 'src/components/backend/auth'
import { useRouter } from 'vue-router'
import { LocalStorage, Notify, QForm } from 'quasar'
import { type User, viewUsers } from 'src/components/backend/user'

const MENU = [
  {
    label: 'Students',
    key: 'student',
    icon: 'person',
  },
  {
    label: 'Instructors',
    key: 'instructor',
    icon: 'person',
  },
  {
    label: 'Courses',
    key: 'course',
    icon: 'menu_book',
  },
  {
    label: 'Logout',
    key: 'logout',
    icon: 'logout',
  },
]

const COLUMNS: {
  name: string;
  label: string;
  field: string | ((row: any) => any);
  required?: boolean;
  align?: 'center' | 'left' | 'right';
  sortable?: boolean;
}[] = [
  {
    name: 'username',
    label: 'USER NAME',
    field: (r: any) => r.username,
    required: true,
    align: 'center',
  },
  {
    name: 'firstName',
    label: 'FIRST NAME',
    field: (r: any) => r.firstName,
    align: 'center',
  },
  {
    name: 'middleName',
    label: 'MIDDLE NAME',
    field: (r: any) => r.middleName,
    align: 'center',
  },
  {
    name: 'lastName',
    label: 'LAST NAME',
    field: (r: any) => r.lastName,
    align: 'center',
  },
  {
    name: 'group',
    label: 'GROUP',
    field: (r: any) => r.group,
    align: 'center',
  },
  {
    name: 'email',
    label: 'EMAIL',
    field: (r: any) => r.email,
    align: 'center',
  },
]

const router = useRouter()
const menuToggle = ref(true)
const loading = ref(false)
const users = ref<User[]>([])

const activeMenu = ref({
  label: 'Students',
  key: 'student',
})

const loginFormRef = ref<QForm>(null as any)
const registrationFormRef = ref<QForm>(null as any)
const forgotPasswordRef = ref<QForm>(null as any)

const { login } = useLogin()

function changeActiveMenu(label: string, key: string) {
  activeMenu.value = { label, key }
  if (key === 'student' || key === 'instructor') {
    loadUsersbyRole(key)
  }

  if (key === 'logout') {
    router.replace('/logout')
  }
}

const { validateToken } = useAuth()
const { viewUsersByRole } = viewUsers()

async function loadUsersbyRole(role: string) {
  try {
    loading.value = true
    const _usersByRole = await viewUsersByRole(role)
    users.value = _usersByRole
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    loading.value = true
    await loadUsersbyRole(activeMenu.value.key)
  } finally {
    loading.value = false
  }
})
</script>

<style lang="sass" scoped>
.container
  width: 1500px
  max-width: 96vw
  height: 86dvh

.login
  border-bottom: 2px solid rgba($primary, 0.2)

.card
  border-radius: 18px
.q-form
  max-width: 30vw

</style>

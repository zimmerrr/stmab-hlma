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
      <div class="row text-center fit q-gutter-lg q-mx-auto">
        <div class="col-12 col-md-6 q-mx-auto q-pa-md bg-secondary">
          <div class="bg-white card full-height q-pt-xs q-pb-md">
            <div class="login text-h6 text-primary text-uppercase">
              <div class="q-my-md">
                {{ activeMenu.label }}
              </div>
            </div>

            <template v-if="activeMenu.key === 'login' || activeMenu.key ==='register'">
              <q-form
                ref="loginFormRef"
                class="text-center q-mx-auto"
                @submit.prevent="onSubmit"
              >
                <div class="column q-col-gutter-md q-pa-sm">
                  <div class="q-mt-xl">
                    <q-input
                      v-model="loginForm.username"
                      label="Username"
                      color="accent"
                      bg-color="white"
                      borderless
                      class="text-primary generic-input q-px-md"
                    />
                  </div>
                  <div>
                    <q-input
                      v-model="loginForm.password"
                      label="Password"
                      bg-color="white"
                      color="accent"
                      borderless
                      class="generic-input q-px-md"
                      :class="{'password-toggle': passwordToggle}"

                      :type="passwordToggle ? 'password' : 'text'"
                    >
                      <template #append>
                        <q-icon
                          :name="passwordToggle ? 'visibility_off' : 'visibility'"
                          class="cursor-pointer"
                          @click="passwordToggle = !passwordToggle"
                        />
                      </template>
                    </q-input>
                  </div>
                  <div>
                    <q-btn
                      :loading="loading"
                      :label="activeMenu.key === 'login' ? 'Login' : 'Register'"
                      type="submit"
                      color="white"
                      flat
                      class="generic-button bg-primary full-width"
                      dense
                      no-caps
                    />
                  </div>
                </div>
              </q-form>
            </template>

            <template v-if="activeMenu.key === 'forgotPassword'">
              <q-form
                ref="forgotPasswordRef"
                class="text-center q-mx-auto"
                @submit.prevent="onSubmit"
              >
                <div class="column q-col-gutter-md q-pa-sm">
                  <div class="q-mt-xl">
                    <q-input
                      v-model="loginForm.username"
                      label="Student Address"
                      color="accent"
                      bg-color="white"
                      borderless
                      class="text-primary generic-input q-px-md"
                    />
                  </div>
                  <div>
                    <q-btn
                      :loading="loading"
                      label="Submit"
                      type="submit"
                      color="white"
                      flat
                      class="generic-button bg-primary full-width"
                      dense
                      no-caps
                    />
                  </div>
                </div>
              </q-form>
            </template>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useLogin, useAuth } from 'src/components/backend/auth'
import { useRouter, useRoute } from 'vue-router'
import { LocalStorage, Notify, QForm } from 'quasar'
import { useViewerUser } from 'src/components/backend/user'

const MENU = [
  {
    label: 'Login',
    key: 'login',
    icon: 'login',
  },
  {
    label: 'Register',
    key: 'register',
    icon: 'person_add',
  },
  {
    label: 'Forgot Password',
    key: 'forgotPassword',
    icon: 'lock_open',
  },
]

const router = useRouter()
const route = useRoute()
const nextUrl = route.query.next || '/'
const menuToggle = ref(false)
const passwordToggle = ref(true)
const loading = ref(false)
const activeMenu = ref({
  label: 'Login',
  key: 'login',
})

const loginForm = reactive({
  username: '',
  password: '',
})

const loginFormRef = ref<QForm>(null as any)
const registrationFormRef = ref<QForm>(null as any)
const forgotPasswordRef = ref<QForm>(null as any)

const { login } = useLogin()
async function onSubmit() {
  try {
    if (loginForm.username.trim() === '' || loginForm.password.trim() === '') {
      return Notify.create({
        message: 'Please enter username and password',
        color: 'negative',
        textColor: 'white',
      })
    }

    loading.value = true
    // login

    await login(loginForm)
    // check user role

    if (isLoggedIn()) {
      if (nextUrl === '/') router.replace('/')
      else router.replace(nextUrl as string)
    } else {
      Notify.create({
        message: 'Invalid username or password',
        color: 'negative',
        textColor: 'white',
      })
    }
  } catch (error) {
    throw new Error('Something went wrong')
  } finally {
    loading.value = false
  }
}

function changeActiveMenu(label: string, key: string) {
  activeMenu.value = { label, key }
  clearForms()
}

function clearForms() {
  loginForm.username = ''
  loginForm.password = ''
}

const { validateToken } = useAuth()

function isLoggedIn() {
  const token = LocalStorage.getItem('AUTH_TOKEN')
  if (!token) return
  const isValid = validateToken(token as string)

  return isValid
}

onMounted(() => {
  if (isLoggedIn()) {
    router.replace('/')
  }
})
</script>

<style lang="sass" scoped>
.container
  width: 1500px
  max-width: 96vw
  height: 45dvh

.login
  border-bottom: 2px solid rgba($primary, 0.2)

.card
  border-radius: 18px
.q-form
  max-width: 30vw

// Mobile
@media screen and (max-width: $breakpoint-xs-max)
  .q-form
    max-width: 90vw
</style>

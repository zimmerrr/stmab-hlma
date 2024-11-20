<template>
  <q-page
    class="flex flex-center bg-primary"
  >
    <div class="container">
      <div class="absolute-top-right q-pa-md">
        <q-btn
          dense
          label="Logout"
          color="black"
          class="q-px-md q-py-sm"
          icon="logout"
          @click="() => router.replace('/logout')"
        />
      </div>
      <div class="row text-center fit q-gutter-lg q-mx-auto">
        <div class="col-12 col-md-5 q-pa-md bg-secondary">
          <div class="bg-white card full-height q-pt-xs q-pb-md">
            <div class="login text-h6 text-primary text-uppercase">
              <div class="q-my-md">
                <span v-if="user">
                  WELCOME, {{ user?.firstName }} {{ user?.lastName }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6 q-pa-md bg-secondary">
          <div class="bg-white card full-height">
            <div class="login text-h6 text-primary text-uppercase">
              <div class="q-my-md">
                GUIDE
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { type User, useViewerUser } from 'src/components/backend/user'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref<User | null>(null)

const { viewUser } = useViewerUser()

onMounted(async () => {
  const _user = await viewUser()
  if (_user) {
    user.value = _user
  }
})
</script>

<style scoped lang="sass">
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

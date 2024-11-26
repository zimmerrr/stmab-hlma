<template>
  <q-page class="flex flex-center bg-primary">
    <div class="container">
      <div class="row text-center fit q-mx-auto">
        <div class="col-12 q-pa-md bg-secondary">
          <div class="bg-white card full-height q-pt-xs">
            <q-table
              :rows="activities"
              class="text-uppercase"
              :loading="loading"
              :columns="COLUMNS"
              :rows-per-page-options="[10, 15, 20, 25, 50]"
              row-key="id"
              :filter="searchQuery"
            >
              <template #loading>
                <q-inner-loading showing>
                  <q-spinner-hourglass
                    size="5em"
                    color="black"
                  />
                </q-inner-loading>
              </template>
              <template #top>
                <div
                  class="text-h6 q-px-md text-white bg-primary cursor-pointer"
                  @click="router.replace('/courses')"
                >
                  <div>
                    <q-icon name="arrow_back_ios_new" /> BACK
                  </div>
                </div>

                <q-space />

                <div class="text-h6 q-mr-md">
                  Activities
                </div>
                <div
                  v-if="user?.role === 'instructor'"
                  class="q-mx-md"
                >
                  <div>
                    <q-btn
                      label="Create Activity"
                      color="green-8"
                      class="q-px-md"
                      @click="showDialog = true;"
                    />
                  </div>
                </div>
              </template>

              <template #header-cell-id="props">
                <q-th
                  :props="props"
                  class="hidden"
                />
              </template>
              <template #body-cell-id="props">
                <q-td
                  :props="props"
                  class="hidden"
                >
                  <span class="highlight-control-number">{{ props.row._id }}</span>
                </q-td>
              </template>

              <template #body-cell-members="props">
                <q-td
                  :props="props"
                >
                  <span class="highlight-control-number">{{ props.row.members.length }}</span>
                </q-td>
              </template>
              <template #body-cell-button="props">
                <q-td :props="props">
                  <div class="row q-gutter-md justify-center">
                    <q-btn
                      label="VIEW ACTIVITY"
                      color="green-8"
                      @click="
                        showActivityDialog = true;
                        form.name = props.row.name;
                        form.description = props.row.description;"
                    />
                    <q-btn
                      v-if="user?.role === 'instructor'"
                      label="DELETE ACTIVITY"
                      color="red"
                      @click="deleteActivity(props.row._id)"
                    />
                  </div>
                </q-td>
              </template>
            </q-table>
          </div>
        </div>
      </div>
    </div>
  </q-page>

  <!-- ACTIVITY DIALOG -->
  <q-dialog
    v-model="showActivityDialog"
    persistent
  >
    <q-card
      style="width: 900px; max-width: 50vw;"
      class="q-pa-md text-uppercase"
    >
      <diV class="absolute-top-right q-mt-sm">
        <q-btn
          flat
          left
          label="Close"
          icon-right="close"
          style="z-index: 1;"
          @click="showActivityDialog = false; clear()"
        />
      </diV>
      <q-card-section class="text-h6 q-pa-none q-mb-md">
        <div>
          {{ form.name }}
        </div>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <div>
          {{ form.description }}
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <!-- ADD DIALOG -->
  <q-dialog
    v-model="showDialog"
    persistent
  >
    <q-card style="width: 900px; max-width: 50vw;">
      <q-form
        ref="formRef"
        class="text-center q-px-md q-mb-md q-mt-sm q-mx-auto"
        @submit.prevent="onSubmit"
      >
        <div class="column q-gutter-md q-pa-sm">
          <div class="text-h4">
            Create Activity
          </div>
          <q-input
            v-model="form.name"
            label="Name"
            color="accent"
            bg-color="white"
            borderless
            hide-bottom-space
            autofocus
            :rules="[(val: any) => !!val || 'This field is required']"
            :disable="loading"
            class="text-primary generic-input q-px-md"
          />
          <q-input
            v-model="form.description"
            label="Description"
            color="accent"
            bg-color="white"
            borderless
            hide-bottom-space
            :rules="[(val: any) => !!val || 'This field is required']"
            :disable="loading"
            class="text-primary generic-input q-px-md"
          />
          <div class="row q-mx-auto q-col-gutter-md q-mt-xs">
            <div>
              <q-btn
                color="orange-13"
                label="Cancel"
                class="q-px-xl generic-button"
                @click="showDialog = false; clear()"
              />
            </div>
            <div>
              <q-btn
                color="red"
                label="Clear"
                class="q-px-xl generic-button"
                @click="clear"
              />
            </div>
            <div>
              <q-btn
                color="green"
                label="Add"
                :loading="loading"
                class="q-px-xl generic-button"
                type="submit"
              />
            </div>
          </div>
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, reactive } from 'vue'
import { useViewerUser, type User } from 'src/components/backend/user'
import { type Activity, viewActivities, addActivity, updateActivity } from 'src/components/backend/course'
import { Dialog, QForm } from 'quasar'

const route = useRoute()
const router = useRouter()
const courseId = ref(route.params.course as string || '')
const user = ref<User>(null as any)
const activities = ref<Activity[]>([])
const loading = ref(false)
const deleteCourseLoading = ref(false)
const showDialog = ref(false)
const showActivityDialog = ref(false)
const formRef = ref<QForm>(null as any)

const { viewUser } = useViewerUser()
const searchQuery = ref('')

const form = reactive({
  _id: '',
  name: '',
  description: '',
})

function clear() {
  form.name = ''
  form.description = ''
}

onMounted(async () => {
  try {
    loading.value = true
    fetchActivities()
    const _user = await viewUser()
    user.value = _user as User
  } finally {
    loading.value = false
  }
})

async function deleteActivity(id: string) {
  try {
    deleteCourseLoading.value = true
    Dialog.create({
      title: 'Confirm Action',
      message: 'Are you sure you want to delete this activity?',
      html: true,
      color: 'black',
      ok: { label: 'Delete Activity', color: 'negative' },
      cancel: true,
    }).onOk(async () => {
      await updateActivity(courseId.value as any, id as any, {
        active: false,
      } as Activity)
      fetchActivities()
    })
  } catch (error) {
    console.error('Error deleting course:', error)
  } finally {
    deleteCourseLoading.value = false
  }
}

async function onSubmit() {
  try {
    loading.value = true
    if (showDialog.value) {
      await addActivity(courseId.value as any, {
        name: form.name,
        description: form.description,
      } as Activity)
    }
    fetchActivities()
    showDialog.value = false
    clear()
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

async function fetchActivities() {
  try {
    loading.value = true
    const response = await viewActivities(courseId.value)
    activities.value = response.activities
    console.log(activities.value, 'test')
  } catch (error) {
    console.error('Error fetching Courses:', error)
  } finally {
    loading.value = false
  }
}

const COLUMNS: {
  name: string;
  label: string;
  field: string | ((row: any) => any);
  required?: boolean;
  align?: 'center' | 'left' | 'right';
  sortable?: boolean;
  class?: string;
}[] = [
  {
    name: 'id',
    label: 'ID',
    field: (r: any) => r._id,
    required: true,
    align: 'center',
  },
  {
    name: 'name',
    label: 'NAME',
    field: (r: any) => r.name,
    required: true,
    align: 'center',
  },
  {
    name: 'description',
    label: 'DESCRIPTION',
    field: (r: any) => r.description,
    align: 'center',
  },
  {
    name: 'button',
    align: 'center',
    field: 'id',
    label: '',
  },
]

</script>

<style lang="sass" scoped>
.container
  width: 94vw

:deep(.q-table__container)
  min-height: 80vh !important

</style>

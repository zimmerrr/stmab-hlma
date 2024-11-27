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
              :wrap-cells="$q.screen.xs ? true : false"
              :dense="$q.screen.xs ? true : false"
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
                    <q-icon name="arrow_back_ios_new" />
                    <span v-if="!$q.screen.xs">
                      BACK
                    </span>
                  </div>
                </div>

                <q-space v-if="!$q.screen.xs" />

                <div
                  class="text-h6 q-mr-md"
                  :class="$q.screen.xs? 'q-ml-md' : ''"
                >
                  Activities
                </div>
                <div
                  v-if="user?.role === 'instructor'"
                  :class="$q.screen.xs? '' : 'q-mx-md'"
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

              <template #header-cell-file="props">
                <q-th
                  :props="props"
                  class="hidden"
                />
              </template>
              <template #body-cell-file="props">
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
                      :label="$q.screen.xs ? 'VIEW' : 'VIEW ACTIVITY'"
                      color="green-8"
                      @click="
                        showActivityDialog = true;
                        form.name = props.row.name;
                        form.description = props.row.description;
                        form.file = props.row.file;"
                    />
                    <q-btn
                      v-if="user?.role === 'instructor'"
                      :label="$q.screen.xs ? 'DELETE' : 'DELETE ACTIVITY'"
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
      style="width: 900px; max-width: 90vw;"
      class="q-pa-md text-uppercase"
    >
      <div class="absolute-top-right q-mt-sm">
        <q-btn
          flat
          left
          label="Close"
          icon-right="close"
          style="z-index: 1;"
          @click="showActivityDialog = false; clear()"
        />
      </div>

      <q-card-section class="text-h6 q-pa-none q-mb-md">
        <div>{{ form.name }}</div>
      </q-card-section>

      <q-card-section class="q-pa-none q-mb-md">
        <div>{{ form.description }}</div>
      </q-card-section>

      <q-card-section
        v-if="form.file"
        class="q-pa-none text-center q-mb-md"
      >
        <q-img
          v-if="isImage(form.file)"
          :src="config.API_HOST + '/' + form.file"
          style="width: 300px; max-height: 400px;"
        />
      </q-card-section>

      <q-card-section
        v-if="form.file"
        class="q-pa-none text-center q-mb-md"
      >
        <div class="q-mb-md">
          {{ getFileName(config.API_HOST + '/' + form.file.substring(8)) }}
        </div>

        <div>
          <q-btn
            label="Download File"
            icon="download"
            color="green"
            @click="downloadFile()"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
  <!-- ADD DIALOG -->
  <q-dialog
    v-model="showDialog"
    persistent
  >
    <q-card style="width: 900px; max-width: 90vw;">
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

          <q-file
            v-model="file"
            filled
            bottom-slots
            label="Upload File"
            counter
            color="black"
            max-total-size="24000000"
          >
            <template #prepend>
              <q-icon
                name="cloud_upload"
                @click.stop.prevent
              />
            </template>
            <template #append>
              <q-icon
                name="close"
                class="cursor-pointer"
                @click.stop.prevent="file = null"
              />
            </template>
          </q-file>
          <div class="row q-mx-auto q-col-gutter-md q-mt-xs">
            <div :class="$q.screen.xs ? 'col-6' : ''">
              <q-btn
                color="red"
                label="Clear"
                class="q-px-xl generic-button"
                @click="clear"
              />
            </div>
            <div :class="$q.screen.xs ? 'col-6' : ''">
              <q-btn
                color="green"
                label="Add"
                :loading="loading"
                class="q-px-xl generic-button"
                type="submit"
              />
            </div>
            <div :class="$q.screen.xs ? 'col-6 q-mx-auto' : ''">
              <q-btn
                color="orange-13"
                label="Cancel"
                class="q-px-xl generic-button"
                @click="showDialog = false; clear()"
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
import { Dialog, QForm, Notify } from 'quasar'
import { useConfig } from 'src/components/backend/config'
import { saveAs } from 'file-saver'

const route = useRoute()
const router = useRouter()
const config = useConfig()
const courseId = ref(route.params.course as string || '')
const user = ref<User>(null as any)
const activities = ref<Activity[]>([])
const loading = ref(false)
const deleteCourseLoading = ref(false)
const showDialog = ref(false)
const showActivityDialog = ref(false)
const formRef = ref<QForm>(null as any)
const file = ref(null as any)
const { viewUser } = useViewerUser()
const searchQuery = ref('')

const form = reactive({
  _id: '',
  name: '',
  description: '',
  file: '',
})

function clear() {
  form.name = ''
  form.description = ''
  file.value = ''
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
        file: file.value,
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

function isImage(filePath: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp']
  const extension = filePath.split('.').pop()?.toLowerCase()
  return extension ? imageExtensions.includes(extension) : false
}

function getFileName(filePath: string) {
  if (!filePath) return 'downloaded-file'
  const parts = filePath.split('/')
  return parts.pop() || 'downloaded-file'
}

async function downloadFile() {
  try {
    loading.value = true

    const fileUrl = ref(config.API_HOST + '/' + form.file)
    const fileName = getFileName(fileUrl.value)
    saveAs(fileUrl.value, fileName)
  } catch (err) {
    console.error('Error downloading file:', err)
    Notify.create({
      type: 'negative',
      message: 'Failed to download the file.',
    })
  } finally {
    loading.value = false
  }
}

async function fetchActivities() {
  try {
    loading.value = true
    const response = await viewActivities(courseId.value)
    activities.value = response.activities
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
    name: 'file',
    label: 'FILE',
    field: (r: any) => r.file,
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

// Mobile
@media screen and (max-width: $breakpoint-xs-max)
  :deep(.q-table--no-wrap th)
    white-space: normal !important
  :deep(.q-table__container)
    white-space: normal !important
</style>

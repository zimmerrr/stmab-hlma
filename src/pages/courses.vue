<template>
  <q-page class="flex flex-center bg-primary">
    <div class="container">
      <div class="row text-center fit q-mx-auto">
        <div class="col-12 q-pa-md bg-secondary">
          <div class="bg-white card full-height q-pt-xs">
            <q-table
              :rows="course"
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
                <div class="row">
                  <div
                    class="text-h6"
                    :class="$q.screen.xs ? 'col-4 q-mr-md' : 'q-pl-md'"
                  >
                    Courses
                  </div>
                  <q-space v-if="!$q.screen.xs" />
                  <q-input
                    v-model="searchQuery"
                    color="accent"
                    filled
                    borderless
                    dense
                    hide-bottom-space
                    :class="$q.screen.xs ? 'col-7 q-mb-sm' : ''"
                    label="Search"
                    debounce="250"
                    class="filter-input"
                  />
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
              <!-- <template #header-cell-members="props">
                <q-th
                  :props="props"
                  class="hidden"
                />
              </template> -->
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
                      label="VIEW COURSE"
                      color="green-8"
                      form.members="props.row.members"
                      @click="router.replace('/' + props.row._id)"
                    />
                    <q-btn
                      label="COPY LINK"
                      color="green-8"
                      form.members="props.row.members"
                      @click="copyLink(props.row._id)"
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

  <!-- MEMBERS DIALOG -->
  <q-dialog
    v-model="showMembersDialog"
    persistent
  >
    <q-card style="width: 900px; max-width: 50vw;">
      <q-form
        ref="formRef"
        class="text-center q-px-md q-mb-md q-mt-sm q-mx-auto"
        @submit.prevent="onSubmit"
      >
        <diV class="absolute-top-right q-mt-sm">
          <q-btn
            icon="close"
            flat
            left
            @click="showMembersDialog = false; clear()"
          />
        </diV>
        <div class="column q-gutter-md q-pa-sm">
          <div class="text-h4 text-uppercase">
            {{ form.username }}
          </div>
          <q-scroll-area style="width: 100%; height: 900px; max-height: 60vh;">
            <ol>
              <div
                v-for="(member, idx) in form.members as any"
                :key="idx"
                class="text-uppercase text-h6"
              >
                <li class="text-left q-pl-md">
                  {{ member.name }}
                  <span v-if="member.group">
                    - {{ member.group }}
                  </span>
                </li>
              </div>
            </ol>
          </q-scroll-area>
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { type Course, addCourse, updateCourse, viewerCourses } from 'src/components/backend/course'
import { Notify, QForm, copyToClipboard } from 'quasar'
import { useRouter, useRoute } from 'vue-router'
import { useConfig } from 'src/components/backend/config'

const router = useRouter()
const route = useRoute()
const config = useConfig()
const showDialog = ref(false)
const showUpdateDialog = ref(false)
const showMembersDialog = ref(false)
const showScanner = ref(false)
const loading = ref(false)

const formRef = ref<QForm>(null as any)
const course = ref<Course[]>([])
const searchQuery = ref('')

const form = reactive({
  _id: '',
  username: '',
  name: '',
  description: '',
  members: null,
})

function clear() {
  form._id = ''
  form.username = ''
  form.name = ''
  form.description = ''
  form.members = null
  formRef.value.reset()
}

async function onSubmit() {
  try {
    loading.value = true
    if (showDialog.value) {
      await addCourse({
        name: form.name,
        description: form.description,
      })
    } else if (showUpdateDialog.value) {
      await updateCourse({
        _id: form._id,
        name: form.name,
        description: form.description,
      })
      showUpdateDialog.value = false
    } else if (showScanner.value) {
      await updateCourse({
        _id: form._id,
        name: form.name,
        description: form.description,
      })
      Notify.create({
        message: 'Course updated successfully',
        color: 'green',
      })

      showScanner.value = false
    }

    fetchCourses()
    clear()
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

function copyLink(id: string) {
  copyToClipboard(config.FRONTEND + '/join/' + id)
  Notify.create({
    message: 'Link copied to clipboard',
    color: 'green',
  })
}

async function fetchCourses() {
  try {
    loading.value = true
    const _course = await viewerCourses()
    course.value = _course.courses
    console.log(course.value)
  } catch (error) {
    console.error('Error fetching Courses:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchCourses)
watch(searchQuery, fetchCourses)

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
    name: 'username',
    label: 'COURSE CODE',
    field: (r: any) => r.username,
    required: true,
    align: 'center',
  },
  {
    name: 'name',
    label: 'NAME',
    field: (r: any) => r.name,
    align: 'center',
  },
  {
    name: 'description',
    label: 'DESCRIPTION',
    field: (r: any) => r.description,
    align: 'center',
  },
  {
    name: 'members',
    label: 'MEMBERS',
    field: (r: any) => r.members,
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

.filter-input
  width: 25% !important
  :deep(.q-field__control)
    border-radius: 0px !important
  :deep(.q-field__native)
    font-size: 1rem !important
  :deep(.q-field__label)
    font-size: 1rem !important

:deep(.q-table__container)
  min-height: 80vh !important

// Mobile
@media screen and (max-width: $breakpoint-xs-max)
  .filter-input
    width: 60% !important
</style>

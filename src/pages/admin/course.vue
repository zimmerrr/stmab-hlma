<template>
  <q-page class="flex flex-center">
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
                <div class="text-h6 q-pl-md">
                  Courses
                </div>
                <q-space />
                <q-input
                  v-model="searchQuery"
                  color="accent"
                  filled
                  borderless
                  dense
                  hide-bottom-space
                  label="Search"
                  debounce="250"
                  class="filter-input"
                />

                <div class="q-mx-md">
                  <div>
                    <q-btn
                      :label="active ? 'Active' : 'Inactive'"
                      class="q-px-md generic-button"
                      flat
                      @click="active ? active = false : active = true; fetchCourses()"
                    />
                  </div>
                </div>
                <div class="q-mr-md">
                  <div>
                    <q-btn
                      color="green"
                      label="Add Course"
                      class="q-px-md generic-button"
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
                      label="MEMBERS"
                      color="orange-13"
                      form.members="props.row.members"
                      @click="
                        showMembersDialog = true;
                        form._id = props.row._id;
                        form.username = props.row.username;
                        form.name = props.row.name;
                        form.description = props.row.description
                        form.members = props.row.members;"
                    />
                    <q-btn
                      v-if="active"
                      label="UPDATE"
                      color="orange-13"
                      @click="
                        showUpdateDialog = true;
                        form._id = props.row._id;
                        form.username = props.row.username;
                        form.name = props.row.name;
                        form.description = props.row.description"
                    />
                    <q-btn
                      :disable="deleteCourseLoading"
                      :label="active ? 'DELETE' : 'RESTORE'"
                      :color="active ? 'red' : 'green'"
                      @click="deleteCourse(props.row._id, props.row.controlNumber)"
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
            Add Course
          </div>
          <q-input
            v-model="form.username"
            label="Course Number"
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
            v-model="form.name"
            label="Name"
            color="accent"
            bg-color="white"
            borderless
            hide-bottom-space
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

  <!-- UPDATE DIALOG -->
  <q-dialog
    v-model="showUpdateDialog"
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
            Update Course
          </div>
          <q-input
            v-model="form.username"
            label="Course Code"
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
            v-model="form.name"
            label="Name"
            color="accent"
            bg-color="white"
            borderless
            hide-bottom-space
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
                @click="showUpdateDialog = false; clear()"
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
                label="Update"
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
import { type Course, type Member, viewCourses, addCourse, updateCourse } from 'src/components/backend/course'
import { Dialog, Notify, QForm } from 'quasar'

const showDialog = ref(false)
const showUpdateDialog = ref(false)
const showMembersDialog = ref(false)
const showScanner = ref(false)
const loading = ref(false)
const deleteCourseLoading = ref(false)
const formRef = ref<QForm>(null as any)

const course = ref<Course[]>([])
const members = ref<Member[]>([])
const searchQuery = ref('')
const active = ref(true)
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
        username: form.username,
        name: form.name,
        description: form.description,
      })
    } else if (showUpdateDialog.value) {
      await updateCourse({
        username: form.username,
        _id: form._id,
        name: form.name,
        description: form.description,
        active: true,
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

async function fetchCourses() {
  try {
    loading.value = true
    const _course = await viewCourses(active.value, searchQuery.value.trim())
    course.value = _course
    console.log(course.value)
  } catch (error) {
    console.error('Error fetching course:', error)
  } finally {
    loading.value = false
  }
}

async function deleteCourse(id: string, controlNumber: string) {
  try {
    deleteCourseLoading.value = true
    if (active.value) {
      Dialog.create({
        title: 'Confirm Action',
        message: `Are you sure you want to delete <b>${controlNumber}</b>?`,
        html: true,
        color: 'black',
        ok: { label: 'Delete Course', color: 'negative' },
        cancel: true,
      }).onOk(async () => {
        await updateCourse({
          _id: id,
          active: false,
        })
        fetchCourses()
      })
    } else {
      Dialog.create({
        title: 'Confirm Action',
        message: `Are you sure you want to restore <b>${controlNumber}</b>?.`,
        html: true,
        color: 'black',
        ok: { label: 'Restore Course', color: 'positive' },
        cancel: true,
      }).onOk(async () => {
        await updateCourse({
          _id: id,
          active: true,
        })
        fetchCourses()
      })
    }
  } catch (error) {
    console.error('Error deleting course:', error)
  } finally {
    deleteCourseLoading.value = false
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

.qr-code
  width: 100%

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

</style>

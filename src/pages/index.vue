<template>
  <q-page
    class="flex flex-center"
  >
    <div v-if="!loading">
      <div
        v-for="(item, idx) in ITEMS"
        :key="idx"
      >
        {{ item._id }}
      </div>
    </div>
    <div v-else>
      <q-spinner size="5vw" />
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useConfig } from 'src/components/backend/config'

const ITEMS = ref<any[]>([])
const config = useConfig()
const loading = ref(false)

onMounted(async () => {
  try {
    loading.value = true
    console.log(process.env)
    const response = await fetch(`${config.API_HOST}/items`)
    if (!response.ok) {
      throw new Error('Failed to fetch items')
    }
    const data = await response.json()
    ITEMS.value = data.items
  } catch (error) {
    console.error('Error fetching items:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped lang="sass">

</style>

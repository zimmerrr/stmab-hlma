<template>
  <q-page
    class="flex flex-center"
  >
    <div>
      <div
        v-for="(item, idx) in ITEMS"
        :key="idx"
      >
        {{ item._id }}
      </div>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const ITEMS = ref<any[]>([])

onMounted(async () => {
  try {
    const response = await fetch('https://g188k323-3000.asse.devtunnels.ms/items')
    if (!response.ok) {
      throw new Error('Failed to fetch items')
    }
    const data = await response.json()
    ITEMS.value = data.items
    console.log(ITEMS.value)
  } catch (error) {
    console.error('Error fetching items:', error)
  }
})
</script>

<style scoped lang="sass">

</style>

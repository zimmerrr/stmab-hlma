<template>
  <q-page />
</template>

<script lang="ts" setup>
import { useLogout } from 'src/components/backend/auth'
import { onMounted } from 'vue'

const logout = useLogout()
onMounted(() => logout)

</script>

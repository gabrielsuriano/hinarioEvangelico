<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const hymnalStore = useHymnalStore()

onMounted(async () => {
  await hymnalStore.loadHymnal()
})
</script>

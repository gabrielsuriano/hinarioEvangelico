<template>
  <ion-app>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp } from '@ionic/vue'

const hymnalStore = useHymnalStore()

onMounted(async () => {
  await hymnalStore.loadHymnal()
})
</script>

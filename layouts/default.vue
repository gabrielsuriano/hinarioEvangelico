<template>
  <ClientOnly>
    <ion-app>
      <slot></slot>
    </ion-app>
  </ClientOnly>
</template>

<script setup lang="ts">
import { IonApp } from '@ionic/vue'
</script>

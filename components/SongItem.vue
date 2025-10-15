<template>
  <div class="song-item" :class="`type-${type.toLowerCase()}`">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { SONG_STRUCTURE } from '~/types/hymnal'

interface Props {
  type: SONG_STRUCTURE
}

defineProps<Props>()
</script>

<style scoped>
.song-item {
  margin-bottom: 0.8rem;
  line-height: 1.8;
}

.type-verse {
  margin-left: 0;
}

.type-chorus,
.type-pre_chorus {
  margin-left: 2rem;
  font-style: italic;
  color: var(--ion-color-medium-shade);
}

.type-bridge {
  margin-left: 1rem;
  font-weight: bold;
}
</style>

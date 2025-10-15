<template>
  <ion-list>
    <ion-item
      v-for="item in items"
      :key="item.id"
      button
      @click="handleClick(item.id)"
    >
      <ion-label>
        <h2>{{ item.number }}. {{ item.title }}</h2>
        <p v-if="item.author">{{ item.author }}</p>
      </ion-label>
      <ion-icon
        slot="end"
        :icon="isFavorite(item.id) ? heart : heartOutline"
        :color="isFavorite(item.id) ? 'danger' : ''"
        @click.stop="toggleFavorite(item.id)"
      ></ion-icon>
    </ion-item>
  </ion-list>
</template>

<script setup lang="ts">
import { IonList, IonItem, IonLabel, IonIcon } from '@ionic/vue'
import { heart, heartOutline } from 'ionicons/icons'
import type { Content } from '~/types/hymnal'

interface Props {
  items: Content[]
  isFavorite: (id: string) => boolean
  toggleFavorite: (id: string) => void
}

const props = defineProps<Props>()

const emit = defineEmits<{
  itemClick: [id: string]
}>()

const handleClick = (id: string) => {
  emit('itemClick', id)
}
</script>

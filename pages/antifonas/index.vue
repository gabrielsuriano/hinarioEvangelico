<template>
  <ClientOnly>
    <ion-page>
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Antifonas</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="presentActionSheet">
              <ion-icon slot="icon-only" :icon="settings"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
        <ion-toolbar>
          <ion-searchbar
            v-model="searchText"
            placeholder="Buscar por título ou texto..."
            animated
            @ionClear="searchText = ''"
          ></ion-searchbar>
        </ion-toolbar>
      </ion-header>

      <ion-content :fullscreen="true">
        <ion-list v-if="filteredAntiphons.length > 0">
          <ion-item
            v-for="antiphon in filteredAntiphons"
            :key="antiphon.id"
            button
            @click="navigateToAntiphon(antiphon.id)"
          >
            <ion-label :style="{ fontSize: hymnalStore.fontSize + 'px' }">
              <h2>{{ antiphon.number }}. {{ antiphon.title }}</h2>
            </ion-label>
            <ion-icon
              slot="end"
              :icon="hymnalStore.isFavorite(antiphon.id) ? heart : heartOutline"
              :color="hymnalStore.isFavorite(antiphon.id) ? 'danger' : ''"
              @click.stop="hymnalStore.toggleFavorite(antiphon.id)"
            ></ion-icon>
          </ion-item>
        </ion-list>

        <ion-text v-else class="ion-padding">
          <p class="ion-text-center">Nenhuma antifona encontrada.</p>
        </ion-text>
      </ion-content>
    </ion-page>
  </ClientOnly>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonSearchbar,
  IonText,
  IonButtons,
  IonButton,
  actionSheetController,
} from '@ionic/vue'
import { heart, heartOutline, settings, add, remove, text } from 'ionicons/icons'
import type { Content } from '~/types/hymnal'

const hymnalStore = useHymnalStore()
const router = useRouter()
const searchText = ref('')

const presentActionSheet = async () => {
  const actionSheet = await actionSheetController.create({
    header: 'Configurações',
    buttons: [
      {
        text: 'Aumentar Fonte',
        icon: add,
        handler: () => {
          hymnalStore.increaseFontSize()
          return false // Mantém o menu aberto
        },
      },
      {
        text: 'Diminuir Fonte',
        icon: remove,
        handler: () => {
          hymnalStore.decreaseFontSize()
          return false // Mantém o menu aberto
        },
      },
      {
        text: 'Fonte Padrão',
        icon: text,
        handler: () => {
          hymnalStore.resetFontSize()
          return false // Mantém o menu aberto
        },
      },
      {
        text: 'Cancelar',
        role: 'cancel',
      },
    ],
  })
  await actionSheet.present()
}

// SEO: Metadados para lista de antifonas
useHead({
  title: 'Antifonas - Hinário Evangélico Metodista',
  meta: [
    {
      name: 'description',
      content: 'Explore as antifonas do Hinário Evangélico Metodista. Textos litúrgicos para adoração.'
    },
    {
      property: 'og:title',
      content: 'Antifonas - Hinário Evangélico Metodista'
    }
  ]
})

const filteredAntiphons = computed(() => {
  if (!searchText.value) {
    return hymnalStore.antiphons
  }
  
  const search = searchText.value.toLowerCase()
  return hymnalStore.antiphons.filter((antiphon: Content) => {
    // Busca em título e número
    const basicMatch = (
      antiphon.title.toLowerCase().includes(search) ||
      antiphon.number?.toString().includes(search)
    )
    
    if (basicMatch) return true
    
    // Busca no conteúdo (texto da antífona)
    if (Array.isArray(antiphon.items)) {
      return antiphon.items.some((item: any) => {
        if (typeof item === 'string') {
          return item.toLowerCase().includes(search)
        }
        if (typeof item === 'object' && item.text) {
          return item.text.toLowerCase().includes(search)
        }
        return false
      })
    }
    
    return false
  })
})

const navigateToAntiphon = (id: string) => {
  router.push(`/antifonas/${id}`)
}
</script>

<style scoped>
ion-label {
  font-size: v-bind('hymnalStore.fontSize + "px"') !important;
}

ion-label h2,
ion-label p {
  font-size: inherit !important;
}
</style>

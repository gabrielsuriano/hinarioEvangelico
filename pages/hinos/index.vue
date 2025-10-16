<template>
  <ClientOnly>
    <ion-page>
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Hinos</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="presentActionSheet">
              <ion-icon slot="icon-only" :icon="settings"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
        <ion-toolbar>
          <ion-searchbar
            v-model="searchText"
            placeholder="Buscar por título, autor ou letra..."
            animated
            @ionClear="searchText = ''"
          ></ion-searchbar>
        </ion-toolbar>
      </ion-header>

      <ion-content :fullscreen="true">
        <ion-list v-if="filteredHymns.length > 0">
          <ion-item
            v-for="hymn in filteredHymns"
            :key="hymn.id"
            button
            @click="navigateToHymn(hymn.id)"
          >
            <ion-label :style="{ fontSize: hymnalStore.fontSize + 'px' }">
              <h2>{{ hymn.number }}. {{ hymn.title }}</h2>
              <p v-if="hymn.author">{{ hymn.author }}</p>
            </ion-label>
            <ion-icon
              slot="end"
              :icon="hymnalStore.isFavorite(hymn.id) ? heart : heartOutline"
              :color="hymnalStore.isFavorite(hymn.id) ? 'danger' : ''"
              @click.stop="hymnalStore.toggleFavorite(hymn.id)"
            ></ion-icon>
          </ion-item>
        </ion-list>

        <ion-text v-else class="ion-padding">
          <p class="ion-text-center">Nenhum hino encontrado.</p>
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

// SEO: Metadados para lista de hinos
useHead({
  title: 'Hinos - Hinário Evangélico Metodista',
  meta: [
    {
      name: 'description',
      content: 'Explore os hinos do Hinário Evangélico Metodista. Busque por título, número, autor ou letra do hino.'
    },
    {
      property: 'og:title',
      content: 'Hinos - Hinário Evangélico Metodista'
    },
    {
      property: 'og:description',
      content: 'Explore os hinos do Hinário Evangélico Metodista'
    }
  ]
})

const filteredHymns = computed(() => {
  if (!searchText.value) {
    return hymnalStore.hymns
  }
  
  const search = searchText.value.toLowerCase()
  return hymnalStore.hymns.filter((hymn: Content) => {
    // Busca em título, número e autor
    const basicMatch = (
      hymn.title.toLowerCase().includes(search) ||
      hymn.number?.toString().includes(search) ||
      hymn.author?.toLowerCase().includes(search)
    )
    
    if (basicMatch) return true
    
    // Busca no conteúdo (letras dos hinos)
    if (Array.isArray(hymn.items)) {
      return hymn.items.some((item: any) => {
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

const navigateToHymn = (id: string) => {
  router.push(`/hinos/${id}`)
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

<template>
  <ClientOnly>
    <ion-page>
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Ritos</ion-title>
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
        <ion-list v-if="filteredRituals.length > 0">
          <ion-item
            v-for="ritual in filteredRituals"
            :key="ritual.id"
            button
            @click="navigateToRitual(ritual.id)"
          >
            <ion-label :style="{ fontSize: hymnalStore.fontSize + 'px' }">
              <h2>{{ ritual.number }}. {{ ritual.title }}</h2>
            </ion-label>
            <ion-icon
              slot="end"
              :icon="hymnalStore.isFavorite(ritual.id) ? heart : heartOutline"
              :color="hymnalStore.isFavorite(ritual.id) ? 'danger' : ''"
              @click.stop="hymnalStore.toggleFavorite(ritual.id)"
            ></ion-icon>
          </ion-item>
        </ion-list>

        <ion-text v-else class="ion-padding">
          <p class="ion-text-center">Nenhum rito encontrado.</p>
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

// SEO: Metadados para lista de ritos
useHead({
  title: 'Ritos - Hinário Evangélico Metodista',
  meta: [
    {
      name: 'description',
      content: 'Explore os ritos litúrgicos do Hinário Evangélico Metodista. Batismo, Santa Ceia e mais.'
    },
    {
      property: 'og:title',
      content: 'Ritos - Hinário Evangélico Metodista'
    }
  ]
})

const filteredRituals = computed(() => {
  if (!searchText.value) {
    return hymnalStore.rituals
  }
  
  const search = searchText.value.toLowerCase()
  return hymnalStore.rituals.filter((ritual: Content) => {
    // Busca em título e número
    const basicMatch = (
      ritual.title.toLowerCase().includes(search) ||
      ritual.number?.toString().includes(search)
    )
    
    if (basicMatch) return true
    
    // Busca no conteúdo (texto do rito)
    if (Array.isArray(ritual.items)) {
      return ritual.items.some((item: any) => {
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

const navigateToRitual = (id: string) => {
  router.push(`/ritos/${id}`)
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

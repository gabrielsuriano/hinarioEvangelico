<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-button @click="goBack">
            <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ content?.title }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="hymnalStore.toggleFavorite(id)">
            <ion-icon
              slot="icon-only"
              :icon="hymnalStore.isFavorite(id) ? heart : heartOutline"
            ></ion-icon>
          </ion-button>
          <ion-button @click="presentActionSheet">
            <ion-icon slot="icon-only" :icon="settings"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <div v-if="content">
        <h1 class="hymn-number">Hino {{ content.number }}</h1>
        <h2 class="hymn-title">{{ content.title }}</h2>
        <p v-if="content.author && content.author.length > 0" class="hymn-author">
          {{ content.author.join(' / ') }}
        </p>

        <div class="hymn-content" :style="{ fontSize: hymnalStore.fontSize + 'px' }">
          <template v-if="Array.isArray(content.items) && typeof content.items[0] === 'object'">
            <div
              v-for="(item, index) in content.items"
              :key="index"
              :class="['hymn-verse', `type-${item.type.toLowerCase()}`]"
            >
              <div v-if="shouldShowVerseNumber(item, index)" class="verse-number">
                [{{ getVerseNumber(item, index) }}]
              </div>
              <div v-for="(line, lineIndex) in item.lines" :key="lineIndex" class="hymn-line">
                {{ line }}
              </div>
            </div>
          </template>
          <template v-else>
            <div v-for="(line, index) in content.items" :key="index" class="hymn-line">
              {{ line }}
            </div>
          </template>
        </div>
      </div>

      <ion-text v-else class="ion-padding">
        <p class="ion-text-center">Hino não encontrado.</p>
      </ion-text>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonText,
  actionSheetController,
} from '@ionic/vue'
import { heart, heartOutline, settings, add, remove, text, arrowBack } from 'ionicons/icons'
import type { Content } from '~/types/hymnal'

const route = useRoute()
const router = useRouter()
const hymnalStore = useHymnalStore()
const id = route.params.id as string

const goBack = () => {
  // Tenta voltar no histórico, se não houver histórico vai para a lista de hinos
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/hinos')
  }
}

// Carrega dados no servidor para SSR
const { data: hymnalData } = await useFetch('/api/hymnal')

// Busca o conteúdo específico para SSR
const content = computed(() => {
  const data = hymnalData.value as any
  if (data?.contents) {
    return data.contents.find((item: any) => item.id === id)
  }
  return null
})

// SEO: Metadados dinâmicos para SSR
useHead(() => ({
  title: content.value?.title 
    ? `${content.value.title} - Hinário Evangélico` 
    : 'Hinário Evangélico',
  meta: [
    {
      name: 'description',
      content: content.value?.title 
        ? `Hino ${content.value.number}: ${content.value.title}${content.value.author && content.value.author.length > 0 ? ' - ' + content.value.author.join(', ') : ''}` 
        : 'Hinário Evangélico Metodista'
    },
    {
      name: 'keywords',
      content: content.value?.title 
        ? `hino ${content.value.number}, ${content.value.title}, hinário metodista, hinário evangélico${content.value.author && content.value.author.length > 0 ? ', ' + content.value.author.join(', ') : ''}` 
        : 'hinário, metodista, evangélico'
    },
    {
      property: 'og:title',
      content: content.value?.title 
        ? `${content.value.title} - Hinário Evangélico` 
        : 'Hinário Evangélico'
    },
    {
      property: 'og:description',
      content: content.value?.title 
        ? `Hino ${content.value.number}: ${content.value.title}` 
        : 'Hinário Evangélico Metodista'
    },
    {
      property: 'og:type',
      content: 'article'
    }
  ]
}))

onMounted(() => {
  if (content.value) {
    hymnalStore.setCurrentContent(content.value as Content)
  }
})

// Conta quantos refrões existem no hino
const chorusCount = computed(() => {
  if (!content.value || !Array.isArray(content.value.items)) return 0
  return (content.value.items as any[]).filter(
    (item) => item.type === 'CHORUS'
  ).length
})

// Determina se deve mostrar o número da estrofe
const shouldShowVerseNumber = (item: any, index: number) => {
  // Sempre mostra para VERSE
  if (item.type === 'VERSE') return true
  
  // Para CHORUS, só mostra se houver mais de um refrão
  if (item.type === 'CHORUS') return chorusCount.value > 1
  
  // PRE_CHORUS e BRIDGE também mostram
  if (item.type === 'PRE_CHORUS' || item.type === 'BRIDGE') return true
  
  return false
}

// Calcula o número da estrofe baseado no tipo
const getVerseNumber = (item: any, index: number) => {
  if (!content.value || !Array.isArray(content.value.items)) return '1'
  
  const items = content.value.items as any[]
  
  // Conta quantas estrofes do mesmo tipo já apareceram antes
  let count = 0
  for (let i = 0; i < index; i++) {
    if (items[i].type === item.type) {
      count++
    }
  }
  
  const number = count + 1
  
  // Adiciona sigla conforme o tipo
  switch (item.type) {
    case 'VERSE':
      return number.toString()
    case 'CHORUS':
      return `C${number}`
    case 'PRE_CHORUS':
      return `PC${number}`
    case 'BRIDGE':
      return `B${number}`
    default:
      return number.toString()
  }
}

const presentActionSheet = async () => {
  const actionSheet = await actionSheetController.create({
    header: 'Opções',
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
</script>

<style scoped>
.hymn-number {
  font-size: 1.2rem;
  color: var(--ion-color-medium);
  margin-bottom: 0.5rem;
}

.hymn-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.hymn-author {
  font-style: italic;
  color: var(--ion-color-medium);
  margin-bottom: 2rem;
}

.hymn-content {
  line-height: 1.8;
}

.hymn-verse {
  margin-bottom: 1.5rem;
}

.verse-number {
  font-weight: bold;
  color: var(--ion-color-primary);
  margin-bottom: 0.5rem;
  font-size: 0.9em;
}

.hymn-line {
  margin-bottom: 0.3rem;
}

.type-verse {
  margin-left: 0;
}

.type-chorus,
.type-pre_chorus {
  margin-left: 2rem;
  font-style: italic;
}

.type-bridge {
  margin-left: 1rem;
  font-weight: bold;
}
</style>

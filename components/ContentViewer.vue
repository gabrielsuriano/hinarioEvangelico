<template>
  <div class="content-viewer">
    <div class="header">
      <h1 v-if="content.number" class="number">
        {{ getTypeLabel() }} {{ content.number }}
      </h1>
      <h2 class="title">{{ content.title }}</h2>
      <p v-if="content.author" class="author">{{ content.author }}</p>
    </div>

    <div class="body" :style="{ fontSize: fontSize + 'px' }">
      <template v-if="isStructuredContent">
        <SongItem
          v-for="(item, index) in structuredItems"
          :key="index"
          :type="item.type"
        >
          <div v-for="(line, lineIndex) in item.lines" :key="lineIndex" class="line">
            {{ line }}
          </div>
        </SongItem>
      </template>
      <template v-else>
        <div v-for="(line, index) in stringItems" :key="index" class="line">
          {{ line }}
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Content, SONG_ITEM } from '~/types/hymnal'

interface Props {
  content: Content
  fontSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  fontSize: 16,
})

const isStructuredContent = computed(() => {
  return (
    Array.isArray(props.content.items) &&
    props.content.items.length > 0 &&
    typeof props.content.items[0] === 'object'
  )
})

const structuredItems = computed(() => {
  return isStructuredContent.value ? (props.content.items as SONG_ITEM[]) : []
})

const stringItems = computed(() => {
  return !isStructuredContent.value ? (props.content.items as string[]) : []
})

const getTypeLabel = () => {
  switch (props.content.type) {
    case 'HYMN':
      return 'Hino'
    case 'ANTIPHON':
      return 'Antifona'
    case 'RITUALS':
      return 'Rito'
    default:
      return ''
  }
}
</script>

<style scoped>
.content-viewer {
  padding: 1rem;
}

.header {
  margin-bottom: 2rem;
}

.number {
  font-size: 1.2rem;
  color: var(--ion-color-medium);
  margin-bottom: 0.5rem;
}

.title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.author {
  font-style: italic;
  color: var(--ion-color-medium);
}

.body {
  line-height: 1.8;
}

.line {
  margin-bottom: 0.8rem;
}
</style>

import { defineStore } from 'pinia'
import type { Hymnal, Content, ContentType } from '~/types/hymnal'

// Versão dos dados - incremente quando fizer mudanças no evangelico.json
const HYMNAL_DATA_VERSION = 2

export const useHymnalStore = defineStore('hymnal', {
  state: () => ({
    hymnal: null as Hymnal | null,
    currentContent: null as Content | null,
    favorites: [] as string[],
    recentlyViewed: [] as string[],
    fontSize: 16,
    dataVersion: 1, // Versão dos dados carregados
  }),

  getters: {
    hymns: (state): Content[] => {
      return state.hymnal?.contents.filter(c => c.type === 'HYMN') || []
    },

    antiphons: (state): Content[] => {
      return state.hymnal?.contents.filter(c => c.type === 'ANTIPHON') || []
    },

    rituals: (state): Content[] => {
      return state.hymnal?.contents.filter(c => c.type === 'RITUALS') || []
    },

    getContentById: (state) => {
      return (id: string): Content | undefined => {
        return state.hymnal?.contents.find(c => c.id === id)
      }
    },

    isFavorite: (state) => {
      return (id: string): boolean => {
        return state.favorites.includes(id)
      }
    },
  },

  actions: {
    async loadHymnal() {
      // Verifica se precisa recarregar por mudança de versão
      const needsReload = this.dataVersion !== HYMNAL_DATA_VERSION

      // Se já carregou e a versão é a mesma, não carrega novamente
      if (this.hymnal && !needsReload) {
        console.log('✅ Hinário já carregado (versão atual), pulando...', {
          version: this.dataVersion,
          hymns: this.hymns.length,
          antiphons: this.antiphons.length,
          rituals: this.rituals.length
        })
        return
      }

      if (needsReload) {
        console.log('🔄 Nova versão detectada! Recarregando hinário...', {
          oldVersion: this.dataVersion,
          newVersion: HYMNAL_DATA_VERSION
        })
      }

      console.log('🔄 Iniciando carregamento do hinário...')
      console.log('📍 Navigator online?', navigator?.onLine)

      // SEMPRE carrega do arquivo local - mais confiável
      try {
        console.log('📁 Carregando do arquivo local...')
        const data = await import('~/hymnals/evangelico.json')
        this.hymnal = data.default as Hymnal
        this.dataVersion = HYMNAL_DATA_VERSION // Atualiza versão
        console.log('✅ Hinário carregado do arquivo local!', {
          version: this.dataVersion,
          hymns: this.hymns.length,
          antiphons: this.antiphons.length,
          rituals: this.rituals.length,
          total: this.hymnal.contents.length
        })
        return
      } catch (error) {
        console.error('❌ Erro ao carregar hinário do arquivo local:', error)
        throw new Error('Não foi possível carregar o hinário. Por favor, recarregue a página.')
      }
    },

    setCurrentContent(content: Content) {
      this.currentContent = content
      this.addToRecentlyViewed(content.id)
    },

    toggleFavorite(id: string) {
      const index = this.favorites.indexOf(id)
      if (index > -1) {
        this.favorites.splice(index, 1)
      } else {
        this.favorites.push(id)
      }
    },

    addToRecentlyViewed(id: string) {
      const index = this.recentlyViewed.indexOf(id)
      if (index > -1) {
        this.recentlyViewed.splice(index, 1)
      }
      this.recentlyViewed.unshift(id)
      if (this.recentlyViewed.length > 20) {
        this.recentlyViewed.pop()
      }
    },

    increaseFontSize() {
      if (this.fontSize < 32) {
        this.fontSize += 2
      }
    },

    decreaseFontSize() {
      if (this.fontSize > 12) {
        this.fontSize -= 2
      }
    },

    resetFontSize() {
      this.fontSize = 16
    },
  },

  persist: {
    // Persiste apenas dados do usuário, NÃO persiste o hymnal
    paths: ['favorites', 'recentlyViewed', 'fontSize', 'dataVersion'],
  },
})

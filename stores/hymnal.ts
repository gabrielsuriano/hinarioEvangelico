import { defineStore } from 'pinia'
import type { Hymnal, Content, ContentType } from '~/types/hymnal'

export const useHymnalStore = defineStore('hymnal', {
  state: () => ({
    hymnal: null as Hymnal | null,
    currentContent: null as Content | null,
    favorites: [] as string[],
    recentlyViewed: [] as string[],
    fontSize: 16,
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
      // Se já carregou, não carrega novamente
      if (this.hymnal) {
        console.log('✅ Hinário já carregado, pulando...', {
          hymns: this.hymns.length,
          antiphons: this.antiphons.length,
          rituals: this.rituals.length
        })
        return
      }
      
      console.log('🔄 Iniciando carregamento do hinário...')
      console.log('📍 Navigator online?', navigator?.onLine)
      
      // Estratégia 1: Tentar API primeiro (funciona melhor com Service Worker em produção)
      if (navigator?.onLine !== false) {
        try {
          console.log('📡 Tentando carregar da API...')
          const data = await $fetch('/api/hymnal', {
            retry: 0,
            timeout: 3000
          })
          this.hymnal = data as Hymnal
          console.log('✅ Hinário carregado da API!', {
            hymns: this.hymns.length,
            antiphons: this.antiphons.length,
            rituals: this.rituals.length,
            total: this.hymnal.contents.length
          })
          return
        } catch (apiError: any) {
          console.warn('⚠️ Falha ao carregar da API:', apiError?.message || apiError)
        }
      } else {
        console.log('📴 Modo offline detectado, pulando API...')
      }
      
      // Estratégia 2: Tentar import do arquivo local (sempre funciona)
      try {
        console.log('📁 Carregando do arquivo local...')
        const data = await import('~/hymnals/evangelico.json')
        this.hymnal = data.default as Hymnal
        console.log('✅ Hinário carregado do arquivo local!', {
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

  persist: true,
})

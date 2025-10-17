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
        console.log('Hinário já carregado, pulando...')
        return
      }
      
      console.log('Iniciando carregamento do hinário...')
      
      try {
        // Tenta carregar do arquivo local primeiro (mais rápido)
        console.log('Tentando carregar do arquivo local...')
        const data = await import('~/hymnals/evangelico.json')
        this.hymnal = data.default as Hymnal
        console.log('Hinário carregado com sucesso do arquivo local!', {
          hymns: this.hymns.length,
          antiphons: this.antiphons.length,
          rituals: this.rituals.length
        })
      } catch (error) {
        console.error('Erro ao carregar hinário do arquivo local:', error)
        
        // Fallback: tenta carregar da API
        try {
          console.log('Tentando carregar da API...')
          const data = await $fetch('/api/hymnal')
          this.hymnal = data as Hymnal
          console.log('Hinário carregado com sucesso da API!')
        } catch (apiError) {
          console.error('Erro ao carregar hinário da API:', apiError)
          console.error('FALHA CRÍTICA: Não foi possível carregar o hinário de nenhuma fonte!')
        }
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

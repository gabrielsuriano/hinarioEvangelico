import { defineStore } from 'pinia'

// Inicializa o tema imediatamente ao carregar o módulo
const initThemeImmediately = () => {
  if (typeof window === 'undefined') return false

  const savedTheme = localStorage.getItem('theme')
  const isDark = savedTheme
    ? savedTheme === 'dark'
    : window.matchMedia('(prefers-color-scheme: dark)').matches

  if (isDark) {
    document.body.classList.add('dark')
  } else {
    document.body.classList.remove('dark')
  }

  return isDark
}

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: initThemeImmediately(),
  }),

  actions: {
    initTheme() {
      // Verifica se há preferência salva no localStorage
      if (typeof window === 'undefined') return

      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        this.isDark = savedTheme === 'dark'
      } else {
        // Se não houver preferência salva, usa a preferência do sistema
        this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      this.applyTheme()
    },

    toggleTheme() {
      this.isDark = !this.isDark
      this.applyTheme()
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
      }
    },

    applyTheme() {
      if (typeof window === 'undefined') return

      if (this.isDark) {
        document.body.classList.add('dark')
      } else {
        document.body.classList.remove('dark')
      }
    },
  },
})

export default defineNuxtPlugin(() => {
  // Aplica o tema imediatamente quando o plugin é carregado no cliente
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme')
    const isDark = savedTheme
      ? savedTheme === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches

    if (isDark) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
  }

  return {
    provide: {}
  }
})

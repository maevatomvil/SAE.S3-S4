import { defineStore } from 'pinia'

export const useLanguageStore = defineStore('language', {
  state: () => ({
    language: localStorage.getItem('language') || 'fr'
  }),
  getters: {
    isEnglish: (state) => state.language === 'en'
  },
  actions: {
    toggleLanguage() {
      this.language = this.isEnglish ? 'fr' : 'en'
      localStorage.setItem('language', this.language)
    }
  }
})

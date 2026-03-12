import { defineStore } from 'pinia'
import { ref } from 'vue'
import initialMessages from '@/datasource/livreDor.json'
import api from "@/services/axios.service.js"

const useSQL = true

export const useLivreDorStore = defineStore('livreDor', (prestataireUsername) => {
  const messages = ref([])
  const ids = ref([])
  const dates = ref([])
  async function loadMessages(prestataireUsername) {
    if (!useSQL) {
      const saved = localStorage.getItem(`livreDor_${prestataireUsername}`)
      const localMessages = saved ? JSON.parse(saved) : []
      messages.value = [...initialMessages, ...localMessages]
    } else {
      const res = await api.get(`/livre-dor/${prestataireUsername}`)
      messages.value = res.data.data.map(m => m.message)
      ids.value = res.data.data.map(m => m.id)
      dates.value = res.data.data.map(m => m.createdAt)
    }
  }

  async function addMessage(newMessage, prestataireUsername) {
    if (!newMessage || newMessage.trim() === '') return
    if (!useSQL) {
      const saved = localStorage.getItem(`livreDor_${prestataireUsername}`)
      const localMessages = saved ? JSON.parse(saved) : []
      localMessages.push(newMessage.trim())
      localStorage.setItem(`livreDor_${prestataireUsername}`, JSON.stringify(localMessages))
      messages.value.push(newMessage.trim())
    } else {
      await api.post(`/livre-dor/${prestataireUsername}`, { message: newMessage })
      await loadMessages(prestataireUsername)
    }
  }

  async function deleteMessage(index, prestataireUsername) {
    if (!useSQL) {
      const saved = localStorage.getItem(`livreDor_${prestataireUsername}`)
      let localMessages = saved ? JSON.parse(saved) : []
      if (index < initialMessages.length) {
        alert("Impossible de supprimer un message provenant du JSON initial")
        return
      }
      localMessages.splice(index - initialMessages.length, 1)
      localStorage.setItem(`livreDor_${prestataireUsername}`, JSON.stringify(localMessages))
      messages.value.splice(index, 1)
    } else {
      await api.delete(`/livre-dor/${ids.value[index]}`)
      await loadMessages(prestataireUsername)
    }
  }

  return { messages, ids, dates, loadMessages, addMessage, deleteMessage }
})
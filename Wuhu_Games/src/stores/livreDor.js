import { defineStore } from 'pinia'
import { ref } from 'vue'
import initialMessages from '@/datasource/livreDor.json'

export const useLivreDorStore = defineStore('livreDor', () => {
  const messages = ref([])

  function loadMessages() {
    const saved = localStorage.getItem('livreDor')
    const localMessages = saved ? JSON.parse(saved) : []
    messages.value = [...initialMessages, ...localMessages]
  }

  function addMessage(newMessage) {
    if (!newMessage || newMessage.trim() === '') return
    const saved = localStorage.getItem('livreDor')
    const localMessages = saved ? JSON.parse(saved) : []
    localMessages.push(newMessage.trim())
    localStorage.setItem('livreDor', JSON.stringify(localMessages))
    messages.value.push(newMessage.trim())
  }

  function deleteMessage(index) {
    const saved = localStorage.getItem('livreDor')
    let localMessages = saved ? JSON.parse(saved) : []
    if (index >= initialMessages.length) {
      localMessages.splice(index - initialMessages.length, 1)
      localStorage.setItem('livreDor', JSON.stringify(localMessages))
      messages.value.splice(index, 1)
    }else{
           const warning = document.createElement('p')
           warning.textContent = "Impossible de supprimer un message provenant du JSON initial"
           warning.style.color = 'red'
           document.body.appendChild(warning)
           setTimeout(() => warning.remove(), 3000)
    }
  }

  loadMessages()

  return { messages, addMessage, deleteMessage }
})

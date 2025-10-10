<template>
  <div class="livre_or ">
    <h1>Livre d'or Hotellerie</h1>

    <p>Vous pouvez laisser ici un avis sur notre hotel</p>
    <input v-model="newMessage" />
    <button @click="addMessage(newMessage)">Enregistrer</button>
    

    <h2>Messages :</h2>
    <ul>
      <li v-for="(msg, index) in messages" :key="index">
        {{ msg }}
        <button @click="deleteMessage(index)">Supprimer</button>
        <br></br><p>----------------------------------------</p><br></br>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useLivreDorStore } from '@/stores/livreDor.js'

const newMessage = ref('')
const store = useLivreDorStore()
const messages = store.messages

function addMessage(msg) {
  store.addMessage(msg)
  newMessage.value = ''
}

function deleteMessage(index) {
  store.deleteMessage(index)
}
</script>


<style scoped>
* {
  font-family: 'Montserrat';
}

.livre_or {
  background-color: #f0f8ff;
  padding: 2px;
  border-radius: 10px;
  width: 1000px;
  margin: 10px auto; 
  text-align: center;
}

.livre_or ul {
  list-style: none; 
  padding: 0;
}
</style>
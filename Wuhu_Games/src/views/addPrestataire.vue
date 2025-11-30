<template>
  <div class="prestataire">
    <div class="prestataire-container">
      <h2 class="prestataire-title">Devenir Prestataire</h2>

      <form @submit.prevent="handleSubmit" class="prestataire-form">
        <div class="input-group">
          <label>Nom du service (sera visible au public)</label>
          <input v-model="form.name" placeholder="Entrez le nom de votre service" required />
        </div>

        <div class="input-group">
          <label>Image du service (sera visible au public)</label>
          <input type="file" @change="handleFileUpload" accept="image/*" required />
        </div>

        <div class="input-group">
          <label>Description (sera visible au public)</label>
          <input v-model="form.shortDescription" placeholder="Paragraphe qui sera affiché sur la page de votre service" required />
        </div>

        <div class="input-group">
          <label>Choisissez vos services</label>

          <div v-for="s in availableServices" :key="s.id" class="service-item">
            <input type="checkbox" :id="s.id" :value="s.id" v-model="form.services" />
            <label :for="s.id">{{ s.name }}</label>

            <button v-if="form.services.includes(s.id)" type="button" class="btn-template" @click="openTemplate(s.id)">Accéder au template</button>
          </div>
        </div>

        <button type="submit" class="btn-submit">Envoyer la demande</button>

        <p v-if="successMessage" class="success">{{ successMessage }}</p>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  name: '',
  image: null,
  shortDescription: '',
  services: []
})

const successMessage = ref('')
const errorMessage = ref('')

function handleFileUpload(event) {
  form.value.image = event.target.files[0]
}

async function handleSubmit() {
  try {
    if (!form.value.image) {
      errorMessage.value = "fournissez une  image"
      return
    }


    successMessage.value = "Votre demande a été envoyée !"
    errorMessage.value = ""

    form.value = {
      name: '',
      image: null,
      shortDescription: '',
      services: []
    }

  } catch (err) {
    errorMessage.value = "Erreur lors de l'envoi de la demande"
    successMessage.value = ""
  }
}

const availableServices = ref([
  { id: 'achat', name: 'Page d’achat' },
  { id: 'reservation', name: 'Réservation' },
  { id: 'planning', name: 'Planning' },
  { id: 'info', name: 'PageInformation' }])

function openTemplate(serviceId) {
  if (serviceId === 'achat') {
    router.push('/AddAchats')
  } else if (serviceId === 'reservation') {
    router.push('/AddReservation')
  } else if (serviceId === 'planning') {
    router.push('/AddPlanning')
  }  else if (serviceId === 'info') {
    router.push('/PageInformation')
  } 

  
}

</script>

<style scoped>
.prestataire {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f6fa;
  z-index: 0;
}

.prestataire-container {
  background: white;
  padding: 40px 60px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.prestataire-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #0000f5;
}

.prestataire-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group label {
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}

.input-group input,
.input-group textarea {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  font-size: 14px;
}

.btn-submit {
  background-color: #0000f5;
  color: white;
  font-weight: 600;
  padding: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.btn-submit:hover {
  background-color: #2828e2;
}

.success {
  color: green;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
}

.error {
  color: red;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
}

.service-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-template {
  background-color: #0000f5;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
}

.btn-template:hover {
  background-color: #2828e2;
}
</style>

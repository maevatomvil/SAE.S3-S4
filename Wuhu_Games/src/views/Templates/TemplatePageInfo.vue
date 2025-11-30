<template>
  <div class="prestataire-page">
    <h2>Créer votre page d'information</h2>

    <input v-model="pageTitle" placeholder="Titre de la page" class="input-title" />

    <Editor
      api-key="yg8t33uwrizbmcft2lm9h9p8cdrojexyb5vh3huzi004nl4a"
      v-model="content"
      :init="{
        toolbar_mode: 'sliding',
        height: 300,
        menubar: true,
        plugins: [
          'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 
          'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount'
        ],
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table | alignleft aligncenter alignright | bullist numlist | emoticons charmap | removeformat'
      }"
    />

    <button @click="savePage" class="btn-save">Sauvegarder la page</button>

    <p v-if="successMessage" class="success">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Editor from '@tinymce/tinymce-vue'

const pageTitle = ref('')
const content = ref('')
const successMessage = ref('')
const errorMessage = ref('')

function savePage() {
  if (!pageTitle.value || !content.value) {
    errorMessage.value = 'Le titre et le contenu sont obligatoires'
    successMessage.value = ''
    return
  }

  console.log('Titre:', pageTitle.value)
  console.log('Contenu HTML:', content.value)

  successMessage.value = 'Page sauvegardée !'
  errorMessage.value = ''
}
</script>

<style scoped>
.prestataire-page {
  max-width: 700px;
  margin: auto;
  padding: 20px;
}

.input-title {
  width: 100%;
  padding: 10px;
  font-size: 18px;
  margin-bottom: 15px;
}

.btn-save {
  padding: 10px 20px;
  background-color: #0000f5;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 15px;
}

.btn-save:hover {
  background-color: #2828e2;
}

.success {
  color: green;
  margin-top: 10px;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>

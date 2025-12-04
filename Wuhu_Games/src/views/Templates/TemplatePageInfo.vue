<template>
  <div class="prestataire-page">
    <h2>Créer votre page d'information</h2>

    <input v-model="pageTitle" placeholder="Titre de la page" class="input-title" />

    <Editor
      api-key="yg8t33uwrizbmcft2lm9h9p8cdrojexyb5vh3huzi004nl4a"
      v-model="content"
      :init="{
        height: 300,
        menubar: false,
        toolbar: 'undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | link media',
        plugins: ['link','lists','media']
      }"
    />

    <button @click="savePage" class="btn-save">Sauvegarder la page</button>

    <p v-if="successMessage" class="success">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Editor from '@tinymce/tinymce-vue'
import TemplateService from '@/services/template.service'

const router = useRouter()

const pageTitle = ref('')
const content = ref('')
const successMessage = ref('')
const errorMessage = ref('')

onMounted(async () => {
  const template = await TemplateService.getCurrentTemplate()
  pageTitle.value = template.pageTitle || ''
  content.value = template.content || ''
})

function savePage() {
  if (!pageTitle.value || !content.value) {
    errorMessage.value = 'Le titre et le contenu sont obligatoires'
    successMessage.value = ''
    return
  }

  TemplateService.saveCurrentTemplate({ pageTitle: pageTitle.value, content: content.value })
  successMessage.value = 'Page sauvegardée !'

  setTimeout(() => {
    router.push('/addPrestataire')
  }, 500)
}
</script>

<style scoped>
.prestataire-page { max-width: 700px; margin: auto; padding: 20px; display:flex; flex-direction:column; gap:10px; }
.input-title { padding:10px; font-size:16px; }
.btn-save { padding:8px 15px; background:#0000f5; color:white; border:none; border-radius:6px; cursor:pointer; }
.btn-save:hover { background:#2828e2; }
.success { color:green; }
.error { color:red; }
</style>

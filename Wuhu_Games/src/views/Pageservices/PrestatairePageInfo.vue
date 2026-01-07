<template>
  <div v-if="prestataire">
    <div v-if="!editMode">
      <h1 style="text-align: center; margin-bottom: 20px;">
        {{ prestataire.pageTitle }}
      </h1>

      <div v-html="prestataire.templateContent"></div>
      <button  v-if="isOwner" @click="editMode = true"  class="btn-edit">
        Modifier la page
      </button>
    </div>

    <div v-else>
      <input v-model="pageTitle" class="input-title" />

      <Editor
        api-key="yg8t33uwrizbmcft2lm9h9p8cdrojexyb5vh3huzi004nl4a"
        v-model="content"
        :init="{
          height: 300,
          menubar: false,
          toolbar: 'undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | link media',
          plugins: ['link','lists','media']
        }"/>

      <button @click="savePage" class="btn-save">Sauvegarder</button>
      <button @click="editMode = false" class="btn-cancel">Annuler</button>
    </div>
  </div>

  <div v-else>
    <h3>Cette page n'existe plus</h3>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Editor from '@tinymce/tinymce-vue'
import TemplateService from '@/services/template.service.js'

const route = useRoute()
const prestataire = ref(null)
const editMode = ref(false)
const isOwner = ref(false)

const pageTitle = ref('')
const content = ref('')

onMounted(async () => {
  const res = await TemplateService.getTemplates()
  prestataire.value = res.data.find(
    p => p.username === route.params.username &&
         p.type === 'prestataireValide'
  ) || null

  const auth = JSON.parse(localStorage.getItem('auth') || '[]')
  const session = auth.find(u => u.session)
  isOwner.value = session && session.username === prestataire.value?.username

  if (prestataire.value) {
    pageTitle.value = prestataire.value.pageTitle
    content.value = prestataire.value.templateContent

    const key = "views_" + prestataire.value.username
    const vues = JSON.parse(localStorage.getItem(key) || "[]")
    const today = new Date().toLocaleDateString()
    const v = vues.find(v => v.date === today)
    v ? v.count++ : vues.push({ date: today, count: 1 })
    localStorage.setItem(key, JSON.stringify(vues))
  }
})

async function savePage() {
  await TemplateService.updateTemplate(prestataire.value.username, {
    pageTitle: pageTitle.value,
    templateContent: content.value
  })

  prestataire.value.pageTitle = pageTitle.value
  prestataire.value.templateContent = content.value

  editMode.value = false
}
</script>

<style scoped>
.btn-edit { margin-top:20px; padding:8px 15px; background:#0000f5; color:white; border:none; border-radius:6px; cursor:pointer; }
.btn-save { padding:8px 15px; background:#00a000; color:white; border:none; border-radius:6px; cursor:pointer; margin-top:10px; }
.btn-cancel { padding:8px 15px; background:#aaa; color:white; border:none; border-radius:6px; cursor:pointer; margin-left:10px; }
.input-title { padding:10px; width:100%; margin-bottom:10px; }
</style>

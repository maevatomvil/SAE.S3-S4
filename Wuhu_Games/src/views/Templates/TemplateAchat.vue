<template>
  <div class="achat-container">
    <h1>Gestion des articles</h1>

    <button class="add-btn" @click="ajouterArticle">Ajouter un article</button>

    <div class="articles">
      <div v-for="article in articles" :key="article.id" class="card">

        <div class="image-zone">
          <img v-if="article.image" :src="article.image" class="image" />
          <div v-else class="image-placeholder"></div>

          <input type="file" class="file-input" @change="e => changerImage(e, article)" accept="image/*" />
        </div>
        <h4>Titre de l'article : </h4>
        <input v-model="article.titre" class="input" />
        <h4>Description : </h4>
        <textarea v-model="article.description" class="textarea"></textarea>
        <h4>Prix : </h4>
        <input type="number" v-model.number="article.prix" class="input" />

        <button class="delete-btn" @click="supprimerArticle(article.id)">Supprimer</button>
      </div>
    </div>

    <button class="save-btn" @click="sauvegarder">Sauvegarder</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import TemplateService from '@/services/template.service'

const articles = ref([])

onMounted(async () => {
  const template = await TemplateService.getCurrentTemplate()
  articles.value = template.articles || []
})

function ajouterArticle() {
  articles.value.push({
    id: uuidv4(),
    titre: "Sans titre",
    description: "Pas de description",
    prix: 0,
    image: null
  })
}

function changerImage(event, article) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    article.image = reader.result
  }
  reader.readAsDataURL(file)
}

function supprimerArticle(id) {
  articles.value = articles.value.filter(a => a.id !== id)
}

function sauvegarder() {
  TemplateService.saveCurrentTemplate({
    articles: articles.value
  })
}
</script>

<style scoped>
.achat-container { max-width:900px; margin:0 auto; padding:20px; }
.add-btn, .save-btn { padding:10px 20px; background:#0000f5; color:white; border:none; border-radius:6px; cursor:pointer; margin-bottom:20px; }
.articles { display:grid; grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); gap:20px; }

.card { background:white; padding:15px; border-radius:10px; box-shadow:0 2px 5px rgba(0,0,0,0.1); display:flex; flex-direction:column; gap:10px; }

.image-zone { width:100%; height:150px; position:relative; }
.image { width:100%; height:100%; object-fit:cover; border-radius:6px; }
.image-placeholder { width:100%; height:100%; background:#e0e0e0; border-radius:6px; }

.file-input { margin-top:5px; }

.input, .textarea { width:100%; padding:8px; border:1px solid #ccc; border-radius:6px; }
.delete-btn { background:red; color:white; border:none; padding:8px; border-radius:6px; cursor:pointer; }
</style>

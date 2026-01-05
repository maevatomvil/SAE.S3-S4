<template>
  <div v-if="prestataire" class="achat-public">

    <h1 style="text-align:center; margin-bottom:20px;">
      {{ prestataire.pageTitleAchat }}
    </h1>

    <div v-html="prestataire.pageDescriptionAchat" class="intro"></div>

    <div v-if="isOwner" style="text-align:center; margin:20px 0;">
      <button class="edit-btn" @click="modifier">Modifier la boutique</button>
    </div>

    <h2>Articles disponibles</h2>

    <div class="articles">
      <div v-for="article in prestataire.articles" :key="article.id" class="card">
        <img v-if="article.image" :src="article.image" class="image" />
        <div v-else class="image-placeholder"></div>

        <h3>{{ article.titre }}</h3>
        <p>{{ article.description }}</p>
        <p><strong>{{ article.prix }} €</strong></p>

        <button class="add-btn" @click="ajouterPanier(article)">Ajouter au panier</button>
      </div>
    </div>

    <h2>Votre panier</h2>

    <div v-if="panier.length > 0" class="panier">
      <div v-for="item in panier" :key="item.id" class="panier-item">
        <p>{{ item.titre }} - {{ item.prix }} €</p>
        <button class="delete-btn" @click="supprimerDuPanier(item.id)">X</button>
      </div>

      <h3>Total : {{ total }} €</h3>
    </div>

    <p v-else>Aucun article dans le panier.</p>

  </div>

  <div v-else>
    <h3>Cette page n'existe plus</h3>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TemplateService from '@/services/template.service'
import { useAuth } from '@/stores/auth.js'

const route = useRoute()
const router = useRouter()
const auth = useAuth()

const prestataire = ref(null)
const panier = ref([])

onMounted(async () => {
  const res = await TemplateService.getTemplates()
  if (res.error === 0) {
    prestataire.value = res.data.find(
      p => p.username === route.params.username && p.type === 'prestataireValide'
    ) || null
  }

  panier.value = JSON.parse(localStorage.getItem('panier') || '[]')
})

const isOwner = computed(() => {
  return auth.authUser?.username === prestataire.value?.username
})

function ajouterPanier(article) {
  panier.value.push(article)
  localStorage.setItem('panier', JSON.stringify(panier.value))
}

function supprimerDuPanier(id) {
  panier.value = panier.value.filter(a => a.id !== id)
  localStorage.setItem('panier', JSON.stringify(panier.value))
}

const total = computed(() => {
  return panier.value.reduce((sum, a) => sum + (a.prix || 0), 0)
})

function modifier() {
  router.push('/AddAchats')
}
</script>

<style scoped>
.achat-public { max-width:900px; margin:0 auto; padding:20px; }
.articles { display:grid; grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); gap:20px; }
.card { background:white; padding:15px; border-radius:10px; box-shadow:0 2px 5px rgba(0,0,0,0.1); display:flex; flex-direction:column; gap:10px; }
.image { width:100%; height:150px; object-fit:cover; border-radius:6px; }
.image-placeholder { width:100%; height:150px; background:#e0e0e0; border-radius:6px; }
.add-btn, .edit-btn { padding:10px 20px; background:#0000f5; color:white; border:none; border-radius:6px; cursor:pointer; }
.panier { margin-top:20px; background:#f7f7f7; padding:15px; border-radius:10px; }
.panier-item { display:flex; justify-content:space-between; align-items:center; padding:5px 0; }
.delete-btn { background:red; color:white; border:none; padding:5px 10px; border-radius:6px; cursor:pointer; }
</style>

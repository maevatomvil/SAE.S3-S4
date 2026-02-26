<template>
  <div v-if="prestataire" class="achat-public">

    <h1 style="text-align:center; margin-bottom:20px;">
      {{ prestataire.pageTitleAchat }}
    </h1>

    <div v-html="prestataire.pageDescriptionAchat" class="intro"></div>

    <div v-if="peutModifier" style="text-align:center; margin:20px 0;">
      <button class="edit-btn" @click="modifierPage">Modifier la boutique</button>
    </div>

    <h2>Articles disponibles</h2>

    <div class="articles">
      <div v-for="article in prestataire.articles" :key="article.id" class="card">

        <img v-if="article.image" :src="article.image" class="image" />
        <div v-else class="image-placeholder"></div>

        <h3>{{ article.titre }}</h3>
        <p>{{ article.description }}</p>
        <p><strong>{{ article.prix }} €</strong></p>

        <p v-if="article.stock > 0">Stock : {{ article.stock }}</p>
        <p v-else style="color:red; font-weight:bold;">Stock : ÉPUISÉ</p>

        <button 
          v-if="!peutModifier"
          class="add-btn"
          @click="ajouterPanier(article)"
          :disabled="article.stock === 0 || !auth.authUser"
          :style="(article.stock === 0 || !auth.authUser) ? 'background:grey; cursor:not-allowed;' : ''"
        >
          {{ !auth.authUser ? "Connectez-vous pour prendre commande" : "Ajouter au panier" }}
        </button>

      </div>
    </div>

    <h2>Votre panier</h2>

    <div v-if="panierGroupe.length > 0" class="panier">
      <div v-for="item in panierGroupe" :key="item.id" class="panier-item">
        <p>{{ item.titre }} - {{ item.prix }} € x{{ item.quantite }}</p>
        <button class="delete-btn" @click="supprimerDuPanier(item.id)">X</button>
      </div>

      <h3>Total : {{ total }} €</h3>

      <button class="finaliser-btn" @click="finaliserCommande">
        Finaliser la commande
      </button>

      <p v-if="messageCommande" style="color:green; margin-top:10px;">
        {{ messageCommande }}
      </p>
    </div>

    <p v-else>Aucun article dans le panier.</p>

    <h2 style="margin-top:40px;">Historique des commandes</h2>

    <div v-if="historiqueCommandes.length > 0" class="historique">
      <div v-for="cmd in historiqueCommandes" :key="cmd.id" class="commande">
        <p><strong>Commande du {{ cmd.date }}</strong></p>
        <ul>
          <li v-for="a in cmd.articles" :key="a.id">
            {{ a.titre }} x{{ a.quantite }} — {{ a.prix }} €
          </li>
        </ul>
      </div>
    </div>

    <p v-else>Aucune commande pour le moment.</p>

  </div>

  <div v-else>
    <h3>Cette page n'existe plus</h3>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TemplateService from '@/services/template.service'
import PrestatairePageAchatService from '@/services/prestatairePageAchat.service'
import { useAuth } from '@/stores/auth.js'

const route = useRoute()
const router = useRouter()
const auth = useAuth()

const prestataire = ref(null)
const panier = ref([])
const historiqueCommandes = ref([])
const messageCommande = ref('')

onMounted(async () => {
  const res = await TemplateService.getTemplates()
  if (res.error === 0) {
    prestataire.value = res.data.find(
      p => p.username === route.params.username && p.type === 'prestataireValide'
    ) || null
  }

  if (prestataire.value?.articles) {
    prestataire.value.articles = prestataire.value.articles.map(a => ({
      ...a,
      stock: a.stock ?? 0
    }))
  }

  panier.value = await PrestatairePageAchatService.getPanier(auth.authUser?.username, prestataire.value.username)
  historiqueCommandes.value = await PrestatairePageAchatService.getHistorique(auth.authUser?.username, prestataire.value.username)
})

const peutModifier = computed(() =>
  auth.authUser?.username === prestataire.value?.username
)

function modifierPage() {
  TemplateService.saveCurrentTemplate(prestataire.value)
  router.push('/AddAchats')
}

async function ajouterPanier(article) {
  if (!auth.authUser) return
  if (article.stock <= 0) return

  article.stock--
  panier.value.push(article)

  await PrestatairePageAchatService.savePanier(auth.authUser.username, prestataire.value.username, panier.value)
  await TemplateService.updateTemplate(prestataire.value.username, { articles: prestataire.value.articles })
}

async function supprimerDuPanier(id) {
  const index = panier.value.findIndex(a => a.id === id)
  if (index !== -1) {
    panier.value.splice(index, 1)
    await PrestatairePageAchatService.savePanier(auth.authUser.username, prestataire.value.username, panier.value)
  }
}

async function finaliserCommande() {
  if (panier.value.length === 0) return

  await PrestatairePageAchatService.finaliserCommande(panier.value, auth.authUser.username, prestataire.value.username)

  panier.value = []
  historiqueCommandes.value = await PrestatairePageAchatService.getHistorique(auth.authUser.username, prestataire.value.username)

  messageCommande.value = `Votre commande est envoyée. Vous devrez la récupérer et payer sur place en donnant votre username : ${auth.authUser.username}`
}

const panierGroupe = computed(() => {
  const map = {}
  for (const item of panier.value) {
    if (!map[item.id]) map[item.id] = { ...item, quantite: 1 }
    else map[item.id].quantite++
  }
  return Object.values(map)
})

const total = computed(() => {
  return panier.value.reduce((sum, a) => sum + (a.prix || 0), 0)
})
</script>

<style scoped>
.achat-public { max-width:900px; margin:0 auto; padding:20px; }
.articles { display:grid; grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); gap:20px; }
.card { background:white; padding:15px; border-radius:10px; box-shadow:0 2px 5px rgba(0,0,0,0.1); display:flex; flex-direction:column; gap:10px; }
.image { width:100%; height:150px; object-fit:cover; border-radius:6px; }
.image-placeholder { width:100%; height:150px; background:#e0e0e0; border-radius:6px; }
.add-btn, .edit-btn, .finaliser-btn { padding:10px 20px; background:#0000f5; color:white; border:none; border-radius:6px; cursor:pointer; }
.panier { margin-top:20px; background:#f7f7f7; padding:15px; border-radius:10px; }
.panier-item { display:flex; justify-content:space-between; align-items:center; padding:5px 0; }
.delete-btn { background:red; color:white; border:none; padding:5px 10px; border-radius:6px; cursor:pointer; }
.commande { background:white; padding:10px; border-radius:8px; margin-bottom:10px; box-shadow:0 1px 3px rgba(0,0,0,0.1); }
</style>

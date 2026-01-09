<template>
  <section class="titre1 main">
    <h1>Wuhu Games</h1>

    <h2 v-if="!isEnglish">{{ subtitleFr }}</h2>
    <h2 v-else>{{ subtitleEn }}</h2>

    <button v-if="isOrganizer" @click="editMode = true" class="btn-edit">Modifier</button>
  </section>

  <div class="page-principale">

    <div v-if="editMode">
      <input v-model="subtitleFr" class="input-title" />
      <input v-model="subtitleEn" class="input-title" />

      <Editor api-key="yg8t33uwrizbmcft2lm9h9p8cdrojexyb5vh3huzi004nl4a" v-model="beforeFr" :init="editorConfig" />
      <Editor api-key="yg8t33uwrizbmcft2lm9h9p8cdrojexyb5vh3huzi004nl4a" v-model="beforeEn" :init="editorConfig" />

      <Editor api-key="yg8t33uwrizbmcft2lm9h9p8cdrojexyb5vh3huzi004nl4a" v-model="afterFr" :init="editorConfig" />
      <Editor api-key="yg8t33uwrizbmcft2lm9h9p8cdrojexyb5vh3huzi004nl4a" v-model="afterEn" :init="editorConfig" />

      <button @click="savePage" class="btn-save">Sauvegarder</button>
      <button @click="editMode = false" class="btn-cancel">Annuler</button>
    </div>

    <div v-else>

      <div v-html="isEnglish ? beforeEn : beforeFr"></div>

      <section class="titre2">
        <h2 v-if="!isEnglish">Des activités sportives pour tous</h2>
        <h2 v-else>Sports activities for everyone</h2>

        <p v-if="!isEnglish">Les participants peuvent s’inscrire à un large choix de <strong>disciplines</strong> accessibles à tous les niveaux :</p>
        <p v-else>Participants can register for a wide range of <strong>disciplines</strong> suitable for all levels:</p>

        <div class="liste-activites">
          <div class="carte-activite" v-if="!isEnglish">Tir à l’arc</div>
          <div class="carte-activite" v-else>Archery</div>

          <div class="carte-activite" v-if="!isEnglish">Canoë-kayak</div>
          <div class="carte-activite" v-else>Canoeing</div>

          <div class="carte-activite" v-if="!isEnglish">Bowling</div>
          <div class="carte-activite" v-else>Bowling</div>

          <div class="carte-activite" v-if="!isEnglish">Golf</div>
          <div class="carte-activite" v-else>Golf</div>

          <div class="carte-activite" v-if="!isEnglish">Tennis de table</div>
          <div class="carte-activite" v-else>Table Tennis</div>

          <div class="carte-activite" v-if="!isEnglish">Tennis</div>
          <div class="carte-activite" v-else>Tennis</div>

          <div class="carte-activite" v-if="!isEnglish">Basketball</div>
          <div class="carte-activite" v-else>Basketball</div>

          <div class="carte-activite" v-if="!isEnglish">Cyclisme</div>
          <div class="carte-activite" v-else>Cycling</div>
        </div>

        <p v-if="!isEnglish">Chaque activité est encadrée par des équipes spécialisées et du <strong>matériel de qualité</strong>.</p>
        <p v-else>Each activity is supervised by specialized teams and uses <strong>high-quality equipment</strong>.</p>
      </section>

      <div v-html="isEnglish ? afterEn : afterFr"></div>

      <div style="width:100%; aspect-ratio:1/1;">
        <MapComponent>
          <div
            v-for="p in prestataires"
            :key="p.id"
            class="pin"
            :style="pinStyle(p)"
            @click="goToPrestataire(p)">
            <span class="pin-label">{{ p.name }}</span>
          </div>
        </MapComponent>
      </div>



    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useLanguageStore } from '@/stores/languageStore.js'
import MapComponent from '@/views/Map.vue'
import HomePageService from '@/services/homepage.service.js'
import Editor from '@tinymce/tinymce-vue'
import TemplateService from '@/services/template.service.js'
import { useRouter } from 'vue-router'
const router = useRouter()

function goToPrestataire(p) {
  router.push(`/prestataire/${p.username}`)
}

const languageStore = useLanguageStore()
const isEnglish = computed(() => languageStore.isEnglish)
const prestataires = ref([])

const editMode = ref(false)
const isOrganizer = ref(false)

const subtitleFr = ref("Faites du sport dans un environnement tropical")
const subtitleEn = ref("Practice sport in a tropical environment")

const beforeFr = ref(`
  <section class="titre1">
    <p>
      Les <strong>Wuhu Games</strong> reviennent pour une nouvelle semaine d’<strong>activités en plein air</strong>, de <strong>compétitions</strong> et d’<strong>animations</strong> au cœur de l’île Wuhu.
      Chaque année, l’événement rassemble <strong>sportifs</strong>, <strong>familles</strong>, <strong>spectateurs</strong> et passionnés souhaitant vivre une <strong>expérience sportive unique</strong> dans un cadre naturel privilégié.
    </p>
  </section>
`)

const beforeEn = ref(`
  <section class="titre1">
    <p>
      The <strong>Wuhu Games</strong> are back for a new week of <strong>outdoor activities</strong>, <strong>competitions</strong> and <strong>events</strong> in the heart of Wuhu Island.
      Every year, the event gathers <strong>athletes</strong>, <strong>families</strong>, <strong>spectators</strong>, and enthusiasts seeking a <strong>unique sporting experience</strong> in a privileged natural setting.
    </p>
  </section>
`)

const afterFr = ref(`
  <section class="titre2">
    <h2>Un séjour simple et complet</h2>
    <ul>
      <li><strong>Réserver un hébergement</strong> sur l’île</li>
      <li><strong>S’inscrire aux compétitions</strong></li>
      <li><strong>S’inscrire en tant que spectateur</strong></li>
      <li><strong>Louer du matériel sportif</strong> directement sur place</li>
    </ul>

    <h2>Prestataires et exposants : rejoignez le village partenaires</h2>
    <p>
      Le <strong>village partenaires</strong> accueille chaque année un large éventail de stands : <strong>marques sportives</strong>, <strong>artisans locaux</strong>, <strong>restaurateurs</strong>, <strong>loueurs de matériel</strong>, <strong>clubs</strong> et <strong>associations</strong>.
    </p>
    <p>
      L’édition précédente a réuni plus de <strong>40 prestataires</strong>, créant un espace animé, attractif et idéal pour présenter <strong>produits et services</strong> aux visiteurs.
      <strong>82 %</strong> des exposants déclarent avoir amélioré leur <strong>visibilité</strong> grâce à l’événement, et près de <strong>70 %</strong> d’entre eux reviennent l'année suivante.
    </p>
    <p>
      Les exposants disposent d’un <strong>emplacement dédié</strong>, d’une <strong>visibilité forte</strong> et de nombreuses possibilités d’<strong>animations</strong> ou de <strong>démonstrations</strong>.
    </p>
  </section>
`)

const afterEn = ref(`
  <section class="titre2">
    <h2>A simple and complete stay</h2>
    <ul>
      <li><strong>Book accommodation</strong> on the island</li>
      <li><strong>Register for competitions</strong></li>
      <li><strong>Register as a spectator</strong></li>
      <li><strong>Rent sports equipment</strong> directly on site</li>
    </ul>

    <h2>Vendors and exhibitors: join the partner village</h2>
    <p>
      The <strong>partner village</strong> hosts each year a wide range of stands: <strong>sports brands</strong>, <strong>local artisans</strong>, <strong>restaurants</strong>, <strong>equipment rental</strong>, <strong>clubs</strong> and <strong>associations</strong>.
    </p>
    <p>
      The previous edition brought together more than <strong>40 vendors</strong>, creating a lively and attractive space to showcase <strong>products and services</strong> to visitors.
      <strong>82%</strong> of exhibitors report improved <strong>visibility</strong> thanks to the event, and nearly <strong>70%</strong> return the following year.
    </p>
    <p>
      Exhibitors have a <strong>dedicated space</strong>, strong <strong>visibility</strong> and many opportunities for <strong>events</strong> or <strong>demonstrations</strong>.
    </p>
  </section>
`)

const editorConfig = {
  height: 300,
  menubar: false,
  toolbar: 'undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | link media',
  plugins: ['link','lists','media']
}

onMounted(async () => {
  const res = await HomePageService.getHomePage()
  const data = res?.data || {}

  if (data.subtitleFr) subtitleFr.value = data.subtitleFr
  if (data.subtitleEn) subtitleEn.value = data.subtitleEn
  if (data.beforeFr) beforeFr.value = data.beforeFr
  if (data.beforeEn) beforeEn.value = data.beforeEn
  if (data.afterFr) afterFr.value = data.afterFr
  if (data.afterEn) afterEn.value = data.afterEn

  const auth = JSON.parse(localStorage.getItem('auth') || '[]')
  const session = auth.find(u => u.session)
  isOrganizer.value = session?.role === "organisateur"
  const res2 = await TemplateService.getTemplates()
  console.log("TEMPLATES =", res2.data)

  prestataires.value = res2.data.filter(t => t.type === 'prestataireValide' && t.x !== undefined && t.y !== undefined)
  console.log("prestataires =", prestataires.value)
})

async function savePage() {
  const data = {
    subtitleFr: subtitleFr.value,
    subtitleEn: subtitleEn.value,
    beforeFr: beforeFr.value,
    beforeEn: beforeEn.value,
    afterFr: afterFr.value,
    afterEn: afterEn.value
  }

  await HomePageService.saveHomePage(data)
  editMode.value = false
}




function pinStyle(p) {
  return {
    left: p.x + '%',
    top: p.y + '%'
  }
}




</script>

<style scoped>
.page-principale {
  padding: 50px 20px;
  font-family: 'Montserrat', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  line-height: 1.8;
}

.main {
  margin: 0;
  width:100%;
  height:100vh;
  background-image: url(/Images/HomePage.png);
  background-color: rgba(0,0,0,0.2);
  background-blend-mode: darken;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.main h1 {
  font-size: 5rem;
  margin-bottom: 0;
  color: white;
  text-align: center;
}

.main h2 {
  color:white;
}

.titre1 p {
  font-size: 1.2rem;
  margin-bottom: 40px;
  color: #444;
  text-align: justify;
}

.titre2 {
  margin-top: 50px;
}

.titre2 h2 {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #6aa0e6;
}

.titre2 p,
.titre2 ul {
  font-size: 1.1rem;
  margin-bottom: 25px;
  color: #444;
  text-align: justify;
}

.liste-activites {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
  justify-content: center;
}

.carte-activite {
  flex: 1 1 200px;
  background-color: #f8f9fa;
  padding: 20px;
  text-align: center;
  border-radius: 12px;
  font-weight: bold;
  box-shadow: 0 6px 12px rgba(0,0,0,0.08);
  transition: transform 0.2s;
}

.carte-activite:hover {
  transform: translateY(-5px);
}

.btn-edit {
  margin-top:20px;
  padding:8px 15px;
  background:#0000f5;
  color:white;
  border:none;
  border-radius:6px;
  cursor:pointer;
}

.btn-save {
  padding:8px 15px;
  background:#00a000;
  color:white;
  border:none;
  border-radius:6px;
  cursor:pointer;
  margin-top:10px;
}

.btn-cancel {
  padding:8px 15px;
  background:#aaa;
  color:white;
  border:none;
  border-radius:6px;
  cursor:pointer;
  margin-left:10px;
}

.input-title {
  padding:10px;
  width:100%;
  margin-bottom:10px;
}



.pin {
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: red;
  border-radius: 50%;
  cursor: pointer;
  transform: translate(-50%, -50%);
}

.pin-label {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  background: black;
  color: white;
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
}

.pin:hover .pin-label {
  opacity: 1;
}


</style>

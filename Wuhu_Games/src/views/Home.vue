<template>
  <div class="page-principale">
    <section class="titre1">
      <h1>Wuhu Games</h1>

      <p v-if="!isEnglish">
        Les <strong>Wuhu Games</strong> reviennent pour une nouvelle semaine d’<strong>activités en plein air</strong>, de <strong>compétitions</strong> et d’<strong>animations</strong> au cœur de l’île Wuhu.
        Chaque année, l’événement rassemble <strong>sportifs</strong>, <strong>familles</strong>, <strong>spectateurs</strong> et passionnés souhaitant vivre une <strong>expérience sportive unique</strong> dans un cadre naturel privilégié.
      </p>
      <p v-else>
        The <strong>Wuhu Games</strong> are back for a new week of <strong>outdoor activities</strong>, <strong>competitions</strong> and <strong>events</strong> in the heart of Wuhu Island.
        Every year, the event gathers <strong>athletes</strong>, <strong>families</strong>, <strong>spectators</strong>, and enthusiasts seeking a <strong>unique sporting experience</strong> in a privileged natural setting.
      </p>
    </section>

    <section class="titre2">
      <h2 v-if="!isEnglish">Des activités sportives pour tous</h2>
      <h2 v-else>Sports activities for everyone</h2>

      <p v-if="!isEnglish">Les participants peuvent s’inscrire à un large choix de <strong>disciplines</strong> accessibles à tous les niveaux :</p>
      <p v-else>Participants can register for a wide range of <strong>disciplines</strong> suitable for all levels:</p>

      <div class="liste-activites">
        <div class="carte-activite" v-if="!isEnglish">Tir à l’arc</div>
        <div class="carte-activite" v-else>Archery</div>

        <div class="carte-activite" v-if="!isEnglish">Canoë-kayak</div>
        <div class="carte-activite" v-else>Canoe-Kayak</div>

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

    <section class="titre2">
      <h2 v-if="!isEnglish">Un séjour simple et complet</h2>
      <h2 v-else>A simple and complete stay</h2>

      <ul>
        <li v-if="!isEnglish"><strong>Réserver un hébergement</strong> sur l’île</li>
        <li v-else><strong>Book accommodation</strong> on the island</li>

        <li v-if="!isEnglish"><strong>S’inscrire aux compétitions</strong></li>
        <li v-else><strong>Register for competitions</strong></li>

        <li v-if="!isEnglish"><strong>S’inscrire en tant que spectateur</strong></li>
        <li v-else><strong>Register as a spectator</strong></li>

        <li v-if="!isEnglish"><strong>Louer du matériel sportif</strong> directement sur place</li>
        <li v-else><strong>Rent sports equipment</strong> directly on site</li>
      </ul>
    </section>

    <section class="titre2">
      <h2 v-if="!isEnglish">Prestataires et exposants : rejoignez le village partenaires</h2>
      <h2 v-else>Vendors and exhibitors: join the partner village</h2>

      <p v-if="!isEnglish">
        Le <strong>village partenaires</strong> accueille chaque année un large éventail de stands : <strong>marques sportives</strong>, <strong>artisans locaux</strong>, <strong>restaurateurs</strong>, <strong>loueurs de matériel</strong>, <strong>clubs</strong> et <strong>associations</strong>.
      </p>
      <p v-else>
        The <strong>partner village</strong> hosts each year a wide range of stands: <strong>sports brands</strong>, <strong>local artisans</strong>, <strong>restaurants</strong>, <strong>equipment rental</strong>, <strong>clubs</strong> and <strong>associations</strong>.
      </p>

      <p v-if="!isEnglish">
        L’édition précédente a réuni plus de <strong>40 prestataires</strong>, créant un espace animé, attractif et idéal pour présenter <strong>produits et services</strong> aux visiteurs.
        <strong>82 %</strong> des exposants déclarent avoir amélioré leur <strong>visibilité</strong> grâce à l’événement, et près de <strong>70 %</strong> d’entre eux reviennent l'année suivante.
      </p>
      <p v-else>
        The previous edition brought together more than <strong>40 vendors</strong>, creating a lively and attractive space to showcase <strong>products and services</strong> to visitors.
        <strong>82%</strong> of exhibitors report improved <strong>visibility</strong> thanks to the event, and nearly <strong>70%</strong> return the following year.
      </p>

      <p v-if="!isEnglish">
        Les exposants disposent d’un <strong>emplacement dédié</strong>, d’une <strong>visibilité forte</strong> et de nombreuses possibilités d’<strong>animations</strong> ou de <strong>démonstrations</strong>.
      </p>
      <p v-else>
        Exhibitors have a <strong>dedicated space</strong>, strong <strong>visibility</strong> and many opportunities for <strong>events</strong> or <strong>demonstrations</strong>.
      </p>
    </section>

    <div style="height:800px">
      <MapComponent/>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLanguageStore } from '@/stores/languageStore.js'
import MapComponent from '@/views/Map.vue'

const languageStore = useLanguageStore()
const isEnglish = computed(() => languageStore.isEnglish)
</script>

<style scoped>
.page-principale {
  padding: 50px 20px;
  font-family: 'Montserrat', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  line-height: 1.8;
}

.titre1 h1 {
  font-size: 3rem;
  margin-bottom: 30px;
  color: #333;
  text-align: center;
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
</style>

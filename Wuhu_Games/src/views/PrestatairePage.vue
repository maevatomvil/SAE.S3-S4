<template>
  <div v-if="prestataire">
    <div class="titre">
      <h1>{{ isEnglish ? prestataire.name_en : prestataire.name }}</h1>
    </div>

    <div class="presentation">
      <p>{{ isEnglish ? prestataire.shortDescription_en : prestataire.shortDescription }}</p>
      <img
        :src="prestataire.image || '/public/image_basket.jpg'"
        :alt="`Image de ${prestataire.name}`"
      />
    </div>

    <div class="presentation_services">
      <h3 v-if="prestataire.services?.length">Nos services :</h3>

      <div class="services_cards" v-if="prestataire.services?.length">
        <div
          v-for="serviceId in prestataire.services"  :key="serviceId"  class="service_card">
          <router-link :to="`/prestataire/${prestataire.username}/${serviceId}`" class="service_link">
            <p>{{ serviceLabel(serviceId) }}</p>
          </router-link>
        </div>
      </div>
     <div :style="peutModifier ? 'margin-top: 40px;' : ''"></div>
      <div class="modif_container" v-if="peutModifier">
        <div class="service_card modif_card" @click="goToEdit">
          <p>{{ isEnglish ? "Edit my page" : "Modifier ma page" }}</p>
        </div>
        <div class="service_card modif_card" @click="goToStats"> <p>{{ isEnglish ? "Statistics" : "Statistiques" }}</p></div>
    </div>

    </div>
  </div>

  <div v-else>
    <h3>Cette page n'existe plus</h3>
  </div>
</template>


<script setup>
import { ref, onMounted,computed } from 'vue'
import { useRoute,useRouter } from 'vue-router'
import TemplateService from '@/services/template.service.js'
import { useAuth } from '@/stores/auth.js'
import PrestataireMenuService from '@/services/prestataireMenu.service.js'
import { useLanguageStore } from '@/stores/languageStore.js'
const languageStore = useLanguageStore()
const isEnglish = computed(() => languageStore.isEnglish)

const router = useRouter()
const auth = useAuth()

const route = useRoute()
const prestataire = ref(null)


function serviceLabel(id) {
  if (!isEnglish.value) {
    return {
      achat: 'Page d’achat',
      reservation: 'Réservation',
      planning: 'Planning',
      info: 'Page d’information'
    }[id] || id
  }

  return {
    achat: 'Shop',
    reservation: 'Booking',
    planning: 'Schedule',
    info: 'Information page'
  }[id] || id
}

onMounted(async () => {
  const res = await TemplateService.getTemplates()
  if (res.error === 0) {
    prestataire.value =
      res.data.find(p =>p.username === route.params.username &&p.type === 'prestataireValide' ) || null
  }
})

const peutModifier = computed(() =>
  auth.authUser?.username === prestataire.value?.username
)


function goToEdit() {
  router.push(`/prestataire/${prestataire.value.username}/edit`)
}


function goToStats() {
  router.push(`/prestataire/${prestataire.value.username}/stats`)
}


</script>

<style scoped>
* {
  font-family: 'Montserrat';
  text-decoration: none;
}

.titre {
  text-align: center;
  padding: 20px;
}

.titre h1 {
  margin-bottom: 30px;
  font-size: 2em;
  color: #333;
}

.presentation {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  max-width: 900px;
  margin: 0 auto;
}

.presentation p {
  flex: 1;
  text-align: justify;
  font-size: 1.1em;
  line-height: 1.6;
  color: #444;
}

.presentation img {
  flex: 1;
  max-width: 60%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.presentation_services {
  background-color: #fff;
  padding: 20px;
  max-width: 900px;
  margin: 30px auto;
  border-radius: 8px;
  text-align: center;
}

.presentation_services h3 {
  margin-bottom: 20px;
}

.services_cards {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.service_card {
  background: #5858d8;
  padding: 20px 25px;
  border-radius: 10px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  width: 250px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  text-align: center;
}

.service_card p {
  margin: 0;
  font-size: 1.05em;
  font-weight: 600;
  color: #ffffff;
}

.service_card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
}


.modif_container {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}


.modif_card {
  cursor: pointer;
  background: #5858d8;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}


.service_link {
  text-decoration: none;
  color: inherit;
}
</style>

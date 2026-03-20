<template>
  <div class="prestataire">
    <div class="prestataire-container">
      <h2 class="prestataire-title"> {{ isEnglish ? "Become a Vendor" : "Devenir Prestataire" }}</h2>
       <span v-if="!isEnglish"> Important : un utilisateur ne peut posséder qu’une seule page prestataire à la fois. <br>Si une demande est déjà en attente la nouvelle ne sera pas prise en compte. </span> <span v-else> Important: a user can only own one vendor page at a time. <br>If a request is already pending, the new one will not be considered. </span>
      <br>
      <form @submit.prevent="handleSubmit" class="prestataire-form">

        <div class="input-group">
          <label>{{ isEnglish ? "Service name (public)" : "Nom du service (sera visible au public)" }}</label>
          <input v-model="form.name" :placeholder="isEnglish ? 'Enter your service name' : 'Entrez le nom de votre service'" required />
        </div>
        <div class="input-group"> <label>{{ isEnglish ? "Service name (English)" : "Nom du service (anglais)" }}</label> <input v-model="form.name_en" placeholder="Enter your service name in English" /> </div>

        <div class="input-group">
          <label>{{ isEnglish ? "Contact email" : "Email de contact" }}</label>
          <input type="email" v-model="form.email" :placeholder="isEnglish ? 'example@mail.com' : 'exemple@mail.com'" required />
        </div>

        <div class="input-group hotel-toggle-card" :class="{ 'hotel-toggle-card--active': form.providerType === 'hotel' }">
          <label class="checkbox-label checkbox-label--hotel">
            <input
              type="checkbox"
              :checked="form.providerType === 'hotel'"
              @change="toggleHotelProvider"
            />
            <span class="hotel-toggle-text">
              {{ isEnglish ? "I want to become a hotel" : "Je souhaite devenir un hôtel" }}
            </span>
          </label>
          <p class="hotel-toggle-hint">
            {{ isEnglish
              ? "Activate this option if you want to publish room availability and prices on the hotel booking calendar."
              : "Activez cette option si vous voulez publier des disponibilités de chambres et des prix sur le calendrier de réservation hôtel." }}
          </p>
        </div>

        <div class="input-group">
          <label>{{ isEnglish ? "Service image (public)" : "Image du service (sera visible au public)" }}</label>
          <input type="file" @change="handleFileUpload" accept="image/*" />
        </div>

        <div class="input-group">
          <label>{{ isEnglish ? "Description (public)" : "Description (sera visible au public)" }}</label>
          <input v-model="form.shortDescription" :placeholder="isEnglish ? 'Short description' : 'Paragraphe affiché sur votre page'" required />
        </div>
        <div class="input-group"> <label>{{ isEnglish ? "Description (English)" : "Description (anglais)" }}</label><input v-model="form.shortDescription_en" placeholder="Short description in English" /> </div>

        <div class="input-group">
          <label>{{ isEnglish ? "Choose your services" : "Choisissez vos services" }}</label>

          <div v-for="s in availableServices" :key="s.id" class="service-item">
            <input type="checkbox" :id="s.id" :value="s.id" v-model="form.services" />
            <label :for="s.id">{{ s.name }}</label>

            <button
              v-if="form.services.includes(s.id) && s.id !== 'livre-dor'"
              type="button"
              class="btn-template"
              @click="openTemplate(s.id)">
               {{ isEnglish ? "Open template" : "Accéder au template" }}
            </button>
          </div>
        </div>

        <div v-if="form.providerType === 'hotel'" class="input-group hotel-group">
          <label>{{ isEnglish ? "Hotel availability" : "Disponibilités de l'hôtel" }}</label>
          <p class="hotel-hint">
            {{ isEnglish
              ? `Add one line per day with available rooms and nightly prices. Only dates from ${eventPeriodLabelEn} are allowed.`
              : `Ajoutez une ligne par jour avec les chambres disponibles et les prix par nuit. Seules les dates du ${eventPeriodLabelFr} sont autorisées.` }}
          </p>

          <div class="hotel-grid-card">
            <div class="hotel-grid-head">
              <span>{{ isEnglish ? 'Day' : 'Jour' }}</span>
              <span>{{ isEnglish ? 'Single rooms' : 'Ch. simples' }}</span>
              <span>{{ isEnglish ? 'Double rooms' : 'Ch. doubles' }}</span>
              <span>{{ isEnglish ? 'Single price' : 'Prix simple' }}</span>
              <span>{{ isEnglish ? 'Double price' : 'Prix double' }}</span>
              <span>{{ isEnglish ? 'Action' : 'Action' }}</span>
            </div>

            <div
              v-for="(slot, index) in form.hotelAvailability"
              :key="`${slot.date || 'new'}-${index}`"
              class="hotel-grid-row"
            >
              <div class="hotel-cell hotel-cell--date">
                <input v-model="slot.date" type="date" :min="EVENT_START_DATE" :max="EVENT_END_DATE" />
              </div>
              <div class="hotel-cell">
                <input v-model.number="slot.simpleAvailable" type="number" min="0" :placeholder="isEnglish ? '0' : '0'" />
              </div>
              <div class="hotel-cell">
                <input v-model.number="slot.doubleAvailable" type="number" min="0" :placeholder="isEnglish ? '0' : '0'" />
              </div>
              <div class="hotel-cell hotel-cell--price">
                <input v-model.number="slot.priceSimple" type="number" min="0" :placeholder="isEnglish ? '0' : '0'" />
                <span class="hotel-currency">EUR</span>
              </div>
              <div class="hotel-cell hotel-cell--price">
                <input v-model.number="slot.priceDouble" type="number" min="0" :placeholder="isEnglish ? '0' : '0'" />
                <span class="hotel-currency">EUR</span>
              </div>
              <button type="button" class="btn-remove" @click="removeHotelAvailability(index)">
                {{ isEnglish ? "Remove" : "Supprimer" }}
              </button>
            </div>

            <div v-if="!form.hotelAvailability.length" class="hotel-empty">
              {{ isEnglish ? 'No day added yet.' : 'Aucun jour ajoute pour le moment.' }}
            </div>
          </div>

          <button type="button" class="btn-template add-row" @click="addHotelAvailability">
            {{ isEnglish ? "Add a day" : "Ajouter un jour" }}
          </button>
        </div>
        <div class="input-group">
          <label>{{ isEnglish ? "Location needs" : "Besoins d’emplacement" }}</label>
          <input v-model="form.locationNeeds" :placeholder="isEnglish ? 'Ex: near water, near village...' : 'Ex : près de l\'eau, près du village ...'" />
        </div>

        <button type="submit" class="btn-submit">
          {{ isEnglish ? "Submit request" : "Envoyer la demande" }}
        </button>


        <p v-if="successMessage" class="success">{{ successMessage }}</p>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
      <h5>
        {{ isEnglish
          ? "⏳ Your request will be reviewed within 24 hours. You will be notified by email."
          : "⏳ Votre demande sera examinée sous 24 heures. Vous serez informé par e-mail."
        }}
      </h5>


    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed} from 'vue'
import { useRouter } from 'vue-router'
import TemplateService from '@/services/template.service'
import { useAuth } from '@/stores/auth.js'
import { useLanguageStore } from '@/stores/languageStore.js'

const auth = useAuth()
const router = useRouter()
const languageStore = useLanguageStore()
const isEnglish = computed(() => languageStore.isEnglish)
const EVENT_START_DATE = '2025-05-11'
const EVENT_END_DATE = '2025-05-24'
const eventPeriodLabelFr = '11/05/2025 au 24/05/2025'
const eventPeriodLabelEn = 'May 11, 2025 to May 24, 2025'

const form = ref({
  name: '',
  name_en: '', 
  email: '',
  providerType: 'standard',
  image: null,
  shortDescription: '',
  shortDescription_en: '',
  services: [],
  hotelAvailability: [],
  username: auth.authUser?.username || '',
  locationNeeds: '',
})

const successMessage = ref('')
const errorMessage = ref('')

onMounted(() => {
  if (!auth.authUser) { 
    router.push('/login')
    return
  }
  const savedForm = JSON.parse(localStorage.getItem('savedForm') || '{}')
  if (savedForm.name) form.value = savedForm
  if (!form.value.services) form.value.services = []
  if (!form.value.hotelAvailability) form.value.hotelAvailability = []
  if (!form.value.providerType) form.value.providerType = 'standard'
  form.value.username = auth.authUser?.username || ''
})

function toggleHotelProvider(event) {
  form.value.providerType = event.target.checked ? 'hotel' : 'standard'

  if (form.value.providerType === 'hotel') {
    form.value.services = form.value.services.filter(service => service !== 'planning')
    if (!form.value.hotelAvailability.length) {
      addHotelAvailability()
    }
  }
}

function addHotelAvailability() {
  form.value.hotelAvailability.push({
    date: EVENT_START_DATE,
    simpleAvailable: 0,
    doubleAvailable: 0,
    priceSimple: 0,
    priceDouble: 0
  })
}

function removeHotelAvailability(index) {
  form.value.hotelAvailability.splice(index, 1)
}

function handleFileUpload(event) {
  form.value.image = event.target.files[0]
}

function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

async function handleSubmit() {
  if (!form.value.name || !form.value.shortDescription || !form.value.email) {
    errorMessage.value = isEnglish.value
      ? "All fields are required"
      : "Tous les champs sont obligatoires"
    return
  }

  if (!form.value.name_en) form.value.name_en = form.value.name
  if (!form.value.shortDescription_en) form.value.shortDescription_en = form.value.shortDescription

  form.value.username = auth.authUser?.username || ''
  form.value.providerType = form.value.providerType || 'standard'

  try {
    const t = await TemplateService.getCurrentTemplate()

    if (form.value.services.includes('achat')) {
      form.value.pageTitleAchat = t.pageTitleAchat || ''
      form.value.pageDescriptionAchat = t.pageDescriptionAchat || ''
      form.value.articles = t.articles || []
    }

    if (form.value.services.includes('info')) {
      form.value.templateContent = t.content || ''
      form.value.pageTitle = t.pageTitle || ''
    }

    if (form.value.services.includes('planning')) {
      form.value.planning = t.planning || []
    }

    if (form.value.providerType === 'hotel') {
      const hotelAvailability = form.value.hotelAvailability
        .filter(item => item.date)
        .filter(item => item.date >= EVENT_START_DATE && item.date <= EVENT_END_DATE)
        .map(item => ({
          date: item.date,
          simpleAvailable: Number(item.simpleAvailable || 0),
          doubleAvailable: Number(item.doubleAvailable || 0),
          priceSimple: Number(item.priceSimple || 0),
          priceDouble: Number(item.priceDouble || 0)
        }))

      if (!hotelAvailability.length) {
        errorMessage.value = isEnglish.value
          ? "Add at least one availability day for the hotel"
          : "Ajoutez au moins un jour de disponibilite pour l'hotel"
        return
      }

      if (hotelAvailability.length !== form.value.hotelAvailability.filter(item => item.date).length) {
        errorMessage.value = isEnglish.value
          ? `Hotel dates must stay between ${eventPeriodLabelEn}`
          : `Les dates de l hotel doivent rester entre le ${eventPeriodLabelFr}`
        return
      }

      form.value.hotelAvailability = hotelAvailability
      form.value.services = form.value.services.filter(service => service !== 'planning')
      if (!form.value.services.includes('reservation')) {
        form.value.services.push('reservation')
      }
    } else {
      form.value.hotelAvailability = []
      form.value.services = form.value.services.filter(service => service !== 'reservation')
    }


    if (form.value.image && typeof form.value.image !== 'string') {
      form.value.image = await convertFileToBase64(form.value.image)
    }

    const result = await TemplateService.saveTemplate(form.value)

    if (result.error === 0) {
      successMessage.value = isEnglish.value
      ? "Form submitted successfully!"
      : "Formulaire envoyé avec succès !"

      errorMessage.value = ''
      form.value = {
        name: '',
        name_en: '',
        email: '',
        providerType: 'standard',
        image: null,
        shortDescription: '',
        shortDescription_en: '',
        services: [],
        hotelAvailability: [],
        username: '',
        locationNeeds: ''
      }
      TemplateService.clearCurrentTemplate()
      localStorage.removeItem('savedForm')
    } else {
      errorMessage.value = result.data
      successMessage.value = ''
    }
  } catch (err) {
    errorMessage.value = isEnglish.value
    ? "Error while submitting the form"
    : "Erreur lors de l’envoi du formulaire"

    successMessage.value = ''
  }
}


const availableServices = computed(() => [
  { id: 'achat', name: isEnglish.value ? 'Shop page' : "Page d'achat" },
  ...(form.value.providerType === 'hotel' ? [] : [{ id: 'planning', name: isEnglish.value ? 'Schedule' : 'Planning' }]),
  { id: 'info', name: isEnglish.value ? 'Information page' : "Page d'information" },
  { id: 'livre-dor', name: isEnglish.value ? 'Guest book' : "Livre d'or" }
])


function openTemplate(serviceId) {
  localStorage.setItem('savedForm', JSON.stringify(form.value))
  if (serviceId === 'achat') router.push('/AddAchats')
  else if (serviceId === 'planning') router.push('/AddPlanning')
  else if (serviceId === 'info') router.push('/PageInformation')

}
</script>

<style scoped>
.prestataire { 
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: linear-gradient(to right, #5858d8, #0080ff);
  padding: 40px 20px;
}
.prestataire-container { 
  background: white;
  padding: 40px 60px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
}



.prestataire-title { font-size:24px; font-weight:bold; margin-bottom:20px; color:#0000f5; }
.prestataire-form { width:100%; display:flex; flex-direction:column; gap:16px; }
.input-group { display:flex; flex-direction:column; }
.input-group label { font-weight:600; margin-bottom:5px; color:#333; }
.input-group input { border:1px solid #ccc; border-radius:8px; padding:10px; font-size:14px; }
.hotel-toggle-card { gap: 8px; padding: 16px; border: 2px solid #d7def8; border-radius: 14px; background: #f7f9ff; }
.hotel-toggle-card--active { border-color: #0000f5; background: #eef1ff; box-shadow: 0 8px 20px rgba(88, 88, 216, 0.12); }
.checkbox-label { display:flex; align-items:center; gap:10px; font-weight:600; }
.checkbox-label--hotel input { width: 18px; height: 18px; }
.hotel-toggle-text { font-size: 16px; }
.hotel-toggle-hint { margin: 0; color:#4b5675; font-size:13px; line-height: 1.5; }
.hotel-group { gap: 10px; }
.hotel-hint { margin: 0; color:#555; font-size:13px; }
.hotel-grid-card { border: 1px solid #dbe1f4; border-radius: 16px; overflow: hidden; background: linear-gradient(180deg, #f8faff 0%, #ffffff 100%); }
.hotel-grid-head,
.hotel-grid-row { display:grid; grid-template-columns: 1.15fr 0.8fr 0.8fr 1.2fr 1.2fr auto; gap:10px; align-items:center; padding: 12px 14px; }
.hotel-grid-head { background:#eaf0ff; font-size:12px; font-weight:700; color:#34405f; text-transform:uppercase; letter-spacing:0.04em; }
.hotel-grid-row { border-top: 1px solid #edf1fb; }
.hotel-cell { display:flex; align-items:center; }
.hotel-cell input { width:100%; }
.hotel-cell--price { gap:8px; min-width: 0; }
.hotel-currency { font-size:12px; font-weight:700; color:#60708f; }
.hotel-empty { padding: 18px 14px; color:#60708f; font-size:14px; text-align:center; }
.btn-submit { background:#0000f5; color:white; font-weight:600; padding:10px; border:none; border-radius:8px; cursor:pointer; }
.btn-submit:hover { background:#2828e2; }
.success { color:green; font-size:14px; text-align:center; margin-top:10px; }
.error { color:red; font-size:14px; text-align:center; margin-top:10px; }
.service-item { display:flex; align-items:center; gap:10px; }
.btn-template { background:#0000f5; color:white; border:none; padding:6px 12px; border-radius:6px; cursor:pointer; font-size:12px; }
.btn-template:hover { background:#2828e2; }
.btn-remove { background:#f2f2f2; color:#222; border:none; padding:10px 12px; border-radius:6px; cursor:pointer; }
.add-row { align-self:flex-start; }

@media (max-width: 900px) {
  .hotel-grid-head { display:none; }
  .hotel-grid-row { grid-template-columns: 1fr; }
  .hotel-cell--price { justify-content:space-between; }
  .btn-remove { width:100%; }
}
</style>

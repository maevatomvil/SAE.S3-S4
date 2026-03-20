<template>
  <div class="prestataire">
    <div class="prestataire-container">

      <h2 class="prestataire-title">
        <span v-if="!isEnglish">Modifier ma page prestataire</span>
        <span v-else>Edit my vendor page</span>
      </h2>

      <p v-if="!hasAccess" class="error">
        <span v-if="!isEnglish">Vous n'avez pas accès à cette page</span>
        <span v-else>You do not have access to this page</span>
      </p>

      <form v-else class="prestataire-form">

        <div class="input-group">
          <label>
            <span v-if="!isEnglish">Nom du service (visible au public)</span>
            <span v-else>Service name (public)</span>
          </label>
          <input v-model="form.name" :placeholder="isEnglish ? 'Enter your service name' : 'Entrez le nom de votre service'" />
        </div>

        <div class="input-group">
          <label>
            <span v-if="!isEnglish">Nom du service (anglais)</span>
            <span v-else>Service name (English)</span>
          </label>
          <input v-model="form.name_en" placeholder="Service name in English" />
        </div>

        <div class="input-group">
          <label>
            <span v-if="!isEnglish">Email de contact</span>
            <span v-else>Contact email</span>
          </label>
          <input type="email" v-model="form.email" :placeholder="isEnglish ? 'example@mail.com' : 'exemple@mail.com'" />
        </div>

        <div class="input-group">
          <label>
            <span v-if="!isEnglish">Image du service (visible au public)</span>
            <span v-else>Service image (public)</span>
          </label>
          <input type="file" @change="handleFileUpload" accept="image/*" />
          <div v-if="form.image">
            <img :src="form.image" :alt="form.name" class="preview-image" />
          </div>
        </div>

        <div class="input-group">
          <label>
            <span v-if="!isEnglish">Description (visible au public)</span>
            <span v-else>Description (public)</span>
          </label>
          <input v-model="form.shortDescription" />
        </div>

        <div class="input-group">
          <label>
            <span v-if="!isEnglish">Description (anglais)</span>
            <span v-else>Description (English)</span>
          </label>
          <input v-model="form.shortDescription_en" placeholder="Short description in English" />
        </div>

        <div class="input-group">
          <label>
            <span v-if="!isEnglish">Choisissez vos services</span>
            <span v-else>Choose your services</span>
          </label>

          <div v-for="s in availableServices" :key="s.id" class="service-item">
            <input type="checkbox" :id="s.id" :value="s.id" v-model="form.services" />

            <label :for="s.id">
              <span v-if="!isEnglish">{{ s.name }}</span>
              <span v-else>
                {{ s.id === 'achat' ? 'Shop page' :
                  s.id === 'planning' ? 'Schedule' :
                  s.id === 'livre-dor' ? 'Guest book' :  'Information page' }}
              </span>
            </label>
          </div>
        </div>

        <div class="input-group">
          <label>
            <span v-if="!isEnglish">Type de prestataire</span>
            <span v-else>Provider type</span>
          </label>
          <input :value="form.providerType === 'hotel' ? (isEnglish ? 'Hotel' : 'Hotel') : (isEnglish ? 'Standard' : 'Standard')" disabled />
        </div>

        <div v-if="form.providerType === 'hotel'" class="input-group hotel-group">
          <label>
            <span v-if="!isEnglish">Disponibilites de l'hotel</span>
            <span v-else>Hotel availability</span>
          </label>
          <p class="hotel-hint">
            <span v-if="!isEnglish">Seules les dates du 11/05/2025 au 24/05/2025 sont autorisées.</span>
            <span v-else>Only dates from May 11, 2025 to May 24, 2025 are allowed.</span>
          </p>

          <div class="hotel-grid-card">
            <div class="hotel-grid-head">
              <span><span v-if="!isEnglish">Jour</span><span v-else>Day</span></span>
              <span><span v-if="!isEnglish">Ch. simples</span><span v-else>Single rooms</span></span>
              <span><span v-if="!isEnglish">Ch. doubles</span><span v-else>Double rooms</span></span>
              <span><span v-if="!isEnglish">Prix simple</span><span v-else>Single price</span></span>
              <span><span v-if="!isEnglish">Prix double</span><span v-else>Double price</span></span>
              <span><span v-if="!isEnglish">Action</span><span v-else>Action</span></span>
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
              <button type="button" class="btn-secondary" @click="removeHotelAvailability(index)">
                <span v-if="!isEnglish">Supprimer</span>
                <span v-else>Remove</span>
              </button>
            </div>

            <div v-if="!form.hotelAvailability.length" class="hotel-empty">
              <span v-if="!isEnglish">Aucun jour ajoute pour le moment.</span>
              <span v-else>No day added yet.</span>
            </div>
          </div>

          <button type="button" class="btn-secondary add-row" @click="addHotelAvailability">
            <span v-if="!isEnglish">Ajouter un jour</span>
            <span v-else>Add a day</span>
          </button>
        </div>

        <button type="button" class="btn-submit" @click="submitForm">
          <span v-if="!isEnglish">Mettre à jour</span>
          <span v-else>Update</span>
        </button>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuth } from '@/stores/auth.js'
import TemplateService from '@/services/template.service.js'
import PrestataireService from '@/services/prestataire.service.js'
import HotelService from '@/services/hotel.service.js'
import { useLanguageStore } from '@/stores/languageStore.js'

const languageStore = useLanguageStore()
const isEnglish = computed(() => languageStore.isEnglish)
const EVENT_START_DATE = '2025-05-11'
const EVENT_END_DATE = '2025-05-24'

const auth = useAuth()

const hasAccess = ref(false)

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
  username: auth.authUser?.username || ''
})

const availableServices = ref([
  { id: 'achat', name: 'Page d’achat' },
  { id: 'planning', name: 'Planning' },
  { id: 'info', name: 'Page d’information' },
  { id: 'livre-dor', name: "Livre d'or" }
  
])

async function submitForm() {
  if (form.value.providerType === 'hotel') {
    const invalidDate = form.value.hotelAvailability.find(
      item => item.date && (item.date < EVENT_START_DATE || item.date > EVENT_END_DATE)
    )

    if (invalidDate) {
      alert(
        isEnglish.value
          ? 'Hotel dates must stay between May 11, 2025 and May 24, 2025.'
          : 'Les dates de l hotel doivent rester entre le 11/05/2025 et le 24/05/2025.'
      )
      return
    }
  }

  const res = await PrestataireService.updatePrestataire(form.value)
  if (form.value.providerType === 'hotel') {
    await HotelService.saveHotelAvailability(form.value.username, form.value.hotelAvailability)
  }
  window.location.reload()
  if (res.error === 0) {
    alert(isEnglish.value ? "Vendor page updated" : "Page prestataire mise à jour")
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

onMounted(async () => {
  const res = await TemplateService.getTemplates()
  if (res.error === 0) {
    const p = res.data.find(
      p => p.username === auth.authUser?.username && p.type === 'prestataireValide'
    )
    if (p) {
      hasAccess.value = true
      form.value = {
        name: p.name,
        name_en: p.name_en || p.name,
        email: p.email || '',
        providerType: p.providerType || 'standard',
        image: p.image || null,
        shortDescription: p.shortDescription || '',
        shortDescription_en: p.shortDescription_en || p.shortDescription,
        services: p.services || [],
        hotelAvailability: p.hotelAvailability || [],
        username: p.username
      }

      if (form.value.providerType === 'hotel' && !form.value.services.includes('reservation')) {
        form.value.services.push('reservation')
      }
    }
  }
})

function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

async function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return
  form.value.image = await convertFileToBase64(file)
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
.btn-submit { background:#0000f5; color:white; font-weight:600; padding:10px; border:none; border-radius:8px; cursor:pointer; }
.btn-submit:hover { background:#2828e2; }
.btn-secondary { background:#ececec; color:#222; border:none; padding:10px 12px; border-radius:8px; cursor:pointer; }
.service-item { display:flex; align-items:center; gap:10px; }
.preview-image { max-width:200px; margin-top:10px; border-radius:8px; }
.error { color:red; font-weight:600; }
.hotel-group { gap:10px; }
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
.add-row { align-self:flex-start; }

@media (max-width: 900px) {
  .hotel-grid-head { display:none; }
  .hotel-grid-row { grid-template-columns: 1fr; }
  .hotel-cell--price { justify-content:space-between; }
  .btn-secondary { width:100%; }
}
</style>

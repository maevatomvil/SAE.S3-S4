<template>
  <div v-if="prestataire" class="reservation-page">
    <div class="titre">
      <h1>{{ isEnglish ? "Book a room" : "Reserver une chambre" }}</h1>
      <h2>{{ isEnglish ? prestataire.name_en : prestataire.name }}</h2>
    </div>

    <div v-if="days.length" class="calendar-container">
      <div class="calendar">
        <div class="calendar__opts">
          <select disabled>
            <option selected>{{ monthLabel }}</option>
          </select>

          <select disabled>
            <option selected>{{ yearLabel }}</option>
          </select>
        </div>

        <div class="calendar__body">
          <div class="calendar__days">
            <div>L</div>
            <div>M</div>
            <div>M</div>
            <div>J</div>
            <div>V</div>
            <div>S</div>
            <div>D</div>
          </div>

          <div class="calendar__dates">
            <div
              v-for="day in days"
              :key="day.date"
              class="calendar__date"
              :class="[
                day.disabled && 'calendar__date--grey',
                !day.disabled && isSelected(day.date) && 'calendar__date--selected',
                isRangeStart(day.date) && 'calendar__date--first-date calendar__date--range-start',
                isRangeEnd(day.date) && 'calendar__date--last-date calendar__date--range-end'
              ]"
              @click="onDayClick(day)"
            >
              <span>{{ day.label }}</span>
            </div>
          </div>
        </div>

        <div class="calendar__buttons">
          <button class="calendar__button calendar__button--grey" @click="resetSelection">
            {{ isEnglish ? "Reset" : "Reinitialiser" }}
          </button>
          <button class="calendar__button calendar__button--primary" @click="applySelection">
            {{ isEnglish ? "Apply" : "Valider" }}
          </button>
        </div>
      </div>
    </div>

    <p v-else class="empty-state">
      {{ isEnglish ? "No hotel availability has been published yet." : "Aucune disponibilite hoteliere n'a encore ete publiee." }}
    </p>

    <div class="reservation-panel" v-if="availabilityInfo">
      <div class="card availability-card">
        <h3>{{ isEnglish ? "Availability" : "Disponibilites" }}</h3>

        <p class="date-range">
          <span v-if="availabilityInfo.mode === 'single'">
            {{ isEnglish ? "For" : "Pour le" }} <strong>{{ formatDateFr(availabilityInfo.startDate) }}</strong>
          </span>
          <span v-else>
            {{ isEnglish ? "From" : "Du" }} <strong>{{ formatDateFr(availabilityInfo.startDate) }}</strong>
            {{ isEnglish ? "to" : "au" }} <strong>{{ formatDateFr(availabilityInfo.endDate) }}</strong>
            ({{ availabilityInfo.nights }} {{ isEnglish ? "night" : "nuit" }}<span v-if="availabilityInfo.nights > 1">s</span>)
          </span>
        </p>

        <ul class="availability-list">
          <li>
            <strong>{{ isEnglish ? "Single room:" : "Chambre simple :" }}</strong>
            <span>{{ availabilityInfo.simple }}</span>
          </li>
          <li>
            <strong>{{ isEnglish ? "Double room:" : "Chambre double :" }}</strong>
            <span>{{ availabilityInfo.double }}</span>
          </li>
        </ul>

        <p class="prices-title">{{ isEnglish ? "Price per night" : "Prix par nuit" }}</p>
        <ul class="availability-list">
          <li>
            <span>{{ isEnglish ? "Single" : "Simple" }}</span>
            <span>{{ availabilityInfo.priceSimple }} EUR</span>
          </li>
          <li>
            <span>{{ isEnglish ? "Double" : "Double" }}</span>
            <span>{{ availabilityInfo.priceDouble }} EUR</span>
          </li>
        </ul>

        <div class="room-options">
          <button
            class="room-button"
            :class="{ 'room-button--selected': selectedRoomType === 'simple' }"
            :disabled="availabilityInfo.simple === 0"
            @click="chooseRoom('simple')"
          >
            {{ isEnglish ? "Single room" : "Chambre simple" }}
          </button>
          <button
            class="room-button"
            :class="{ 'room-button--selected': selectedRoomType === 'double' }"
            :disabled="availabilityInfo.double === 0"
            @click="chooseRoom('double')"
          >
            {{ isEnglish ? "Double room" : "Chambre double" }}
          </button>
        </div>
      </div>

      <div v-if="recap" class="card recap-card">
        <h3>{{ isEnglish ? "Stay summary" : "Recapitulatif du sejour" }}</h3>
        <p>
          {{ isEnglish ? "From" : "Du" }} <strong>{{ formatDateFr(recap.startDate) }}</strong>
          {{ isEnglish ? "to" : "au" }} <strong>{{ formatDateFr(recap.endDate) }}</strong>
        </p>
        <p>
          {{ isEnglish ? "Room type:" : "Type de chambre :" }}
          <strong>{{ recap.roomType === 'simple' ? (isEnglish ? 'Single' : 'Simple') : 'Double' }}</strong>
        </p>
        <p>
          {{ isEnglish ? "Total price:" : "Prix total :" }}
          <strong>{{ recap.total }} EUR</strong>
        </p>

        <button class="validate-button" :disabled="!auth.authUser || isSubmitting" @click="validateOrder">
          {{
            !auth.authUser
              ? (isEnglish ? "Login to book" : "Connectez-vous pour reserver")
              : isSubmitting
                ? (isEnglish ? "Booking..." : "Reservation en cours...")
                : (isEnglish ? "Confirm booking" : "Confirmer la reservation")
          }}
        </button>
      </div>

    </div>

    <div v-if="message" class="reservation-panel">
      <div class="card status-card">
        <p :class="messageType">{{ message }}</p>
        <div v-if="reservationDetails" class="reservation-summary">
          <p>
            {{ isEnglish ? "Dates:" : "Dates :" }}
            <strong>
              {{ formatDateFr(reservationDetails.startDate) }}
              <span v-if="reservationDetails.endDate !== reservationDetails.startDate">
                {{ isEnglish ? " to " : " au " }}{{ formatDateFr(reservationDetails.endDate) }}
              </span>
            </strong>
          </p>
          <p>
            {{ isEnglish ? "Room type:" : "Type de chambre :" }}
            <strong>{{ reservationDetails.roomType === 'simple' ? (isEnglish ? 'Single' : 'Simple') : 'Double' }}</strong>
          </p>
          <p>
            {{ isEnglish ? "Price:" : "Prix :" }}
            <strong>{{ reservationDetails.totalPrice }} EUR</strong>
          </p>
        </div>
        <p v-if="reservationCode" class="reservation-code">
          <span>{{ isEnglish ? "Booking code:" : "Code de reservation :" }}</span>
          <strong>{{ reservationCode }}</strong>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue"
import { useRoute } from "vue-router"
import { useLanguageStore } from "@/stores/languageStore.js"
import { useAuth } from "@/stores/auth.js"
import TemplateService from "@/services/template.service.js"
import HotelService from "@/services/hotel.service.js"

const route = useRoute()
const auth = useAuth()
const languageStore = useLanguageStore()
const isEnglish = computed(() => languageStore.isEnglish)

const prestataire = ref(null)
const availability = ref({})
const rangeStart = ref(null)
const rangeEnd = ref(null)
const availabilityInfo = ref(null)
const selectedRoomType = ref(null)
const message = ref("")
const messageType = ref("success")
const isSubmitting = ref(false)
const reservationCode = ref("")
const reservationDetails = ref(null)

function normalizeDateKey(value) {
  if (!value) return ""
  if (typeof value === "string") return value.slice(0, 10)
  return String(value).slice(0, 10)
}

function applyAvailabilityRows(rows) {
  availability.value = Object.fromEntries(
    rows
      .filter(item => item?.date)
      .map(item => [normalizeDateKey(item.date), { ...item, date: normalizeDateKey(item.date) }])
  )
}

const sortedDates = computed(() => Object.keys(availability.value).sort())

const days = computed(() => sortedDates.value.map(date => ({
  date,
  label: Number(date.slice(-2)),
  disabled: false
})))

const monthLabel = computed(() => {
  const firstDate = sortedDates.value[0]
  if (!firstDate) return isEnglish.value ? "Month" : "Mois"
  const [year, month, day] = firstDate.split("-").map(Number)
  return new Intl.DateTimeFormat(isEnglish.value ? "en-GB" : "fr-FR", { month: "long" })
    .format(new Date(Date.UTC(year, month - 1, day)))
})

const yearLabel = computed(() => sortedDates.value[0]?.slice(0, 4) || "2025")

const selectedDatesList = computed(() => {
  if (!rangeStart.value) return []
  const start = rangeStart.value
  const end = rangeEnd.value || rangeStart.value
  return sortedDates.value.filter(date => date >= start && date <= end)
})

const recap = computed(() => {
  if (!availabilityInfo.value || !selectedRoomType.value) return null
  const pricePerNight = selectedRoomType.value === "simple"
    ? availabilityInfo.value.priceSimple
    : availabilityInfo.value.priceDouble

  return {
    roomType: selectedRoomType.value,
    startDate: availabilityInfo.value.startDate,
    endDate: availabilityInfo.value.endDate,
    total: pricePerNight * availabilityInfo.value.nights
  }
})

function getNextDate(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number)
  const d = new Date(Date.UTC(year, month - 1, day))
  d.setUTCDate(d.getUTCDate() + 1)
  return d.toISOString().slice(0, 10)
}

function onDayClick(day) {
  if (day.disabled) return
  availabilityInfo.value = null
  selectedRoomType.value = null
  message.value = ""
  reservationCode.value = ""
  reservationDetails.value = null

  if (!rangeStart.value || rangeEnd.value) {
    rangeStart.value = day.date
    rangeEnd.value = null
    return
  }

  if (day.date === rangeStart.value) {
    rangeEnd.value = null
    return
  }

  if (day.date < rangeStart.value) {
    rangeEnd.value = rangeStart.value
    rangeStart.value = day.date
    return
  }

  rangeEnd.value = day.date
}

function isSelected(date) {
  if (!rangeStart.value) return false
  if (!rangeEnd.value) return date === rangeStart.value
  return date >= rangeStart.value && date <= rangeEnd.value
}

function isRangeStart(date) {
  return rangeStart.value === date
}

function isRangeEnd(date) {
  return rangeEnd.value === date && rangeEnd.value !== rangeStart.value
}

function resetSelection() {
  rangeStart.value = null
  rangeEnd.value = null
  availabilityInfo.value = null
  selectedRoomType.value = null
}

function applySelection() {
  const dates = selectedDatesList.value
  if (!dates.length) {
    availabilityInfo.value = null
    return
  }

  let current = dates[0]
  const end = dates[dates.length - 1]
  while (current <= end) {
    if (!availability.value[current]) {
      message.value = isEnglish.value
        ? "The selected period contains unavailable dates."
        : "La periode choisie contient des dates indisponibles."
      messageType.value = "error"
      availabilityInfo.value = null
      return
    }
    current = getNextDate(current)
  }

  let minSimple = Infinity
  let minDouble = Infinity
  let priceSimple = null
  let priceDouble = null

  dates.forEach((date, index) => {
    const item = availability.value[date]
    minSimple = Math.min(minSimple, item.simpleAvailable)
    minDouble = Math.min(minDouble, item.doubleAvailable)
    if (index === 0) {
      priceSimple = item.priceSimple
      priceDouble = item.priceDouble
    }
  })

  availabilityInfo.value = {
    mode: dates.length === 1 ? "single" : "range",
    startDate: dates[0],
    endDate: dates[dates.length - 1],
    nights: dates.length,
    simple: minSimple,
    double: minDouble,
    priceSimple,
    priceDouble
  }

  selectedRoomType.value = null
  message.value = ""
}

function chooseRoom(type) {
  selectedRoomType.value = type
}

function formatDateFr(date) {
  const normalized = normalizeDateKey(date)
  const [year, month, day] = normalized.split("-")

  if (!year || !month || !day) return normalized

  return isEnglish.value
    ? `${day}/${month}/${year}`
    : `${day}/${month}/${year}`
}

async function loadPrestataire() {
  const res = await TemplateService.getTemplates()
  if (res.error === 0) {
    prestataire.value = res.data.find(
      item => item.username === route.params.username && item.type === "prestataireValide"
    ) || null

    if (prestataire.value?.providerType === "hotel" && Array.isArray(prestataire.value.hotelAvailability)) {
      applyAvailabilityRows(prestataire.value.hotelAvailability)
    }
  }
}

async function loadAvailability() {
  try {
    const res = await HotelService.getHotelAvailability(route.params.username)
    if (res.error === 0 && Array.isArray(res.data) && res.data.length) {
      applyAvailabilityRows(res.data)
      return
    }

    if (!Object.keys(availability.value).length) {
      message.value = isEnglish.value
        ? "No published availability found for this hotel."
        : "Aucune disponibilite publiee trouvee pour cet hotel."
      messageType.value = "error"
    }
  } catch (error) {
    if (!Object.keys(availability.value).length) {
      message.value = isEnglish.value
        ? "Unable to load hotel availability right now."
        : "Impossible de charger les disponibilites de l hotel pour le moment."
      messageType.value = "error"
    }
  }
}

async function validateOrder() {
  if (!auth.authUser || !recap.value) return

  isSubmitting.value = true
  message.value = ""
  reservationCode.value = ""
  reservationDetails.value = null

  try {
    const result = await HotelService.createHotelReservation({
      prestataireUsername: route.params.username,
      username: auth.authUser.username,
      roomType: recap.value.roomType,
      startDate: recap.value.startDate,
      endDate: recap.value.endDate
    })

    if (result.error === 0) {
      await loadAvailability()
      resetSelection()
      reservationCode.value = result.data.reservationCode || ""
      reservationDetails.value = {
        startDate: result.data.startDate,
        endDate: result.data.endDate,
        roomType: result.data.roomType,
        totalPrice: result.data.totalPrice
      }
      message.value = isEnglish.value
        ? `Booking confirmed. Total: ${result.data.totalPrice} EUR`
        : `Réservation confirmée. Total : ${result.data.totalPrice} EUR`
      messageType.value = "success"
    } else {
      const fallbackError = isEnglish.value
        ? `Booking failed for ${recap.value.startDate}${recap.value.endDate !== recap.value.startDate ? ` to ${recap.value.endDate}` : ""}.`
        : `La réservation a échoué pour ${formatDateFr(recap.value.startDate)}${recap.value.endDate !== recap.value.startDate ? ` au ${formatDateFr(recap.value.endDate)}` : ""}.`

      message.value = typeof result.data === "string" && result.data.trim()
        ? result.data
        : fallbackError
      messageType.value = "error"
    }
  } catch {
    message.value = isEnglish.value
      ? "An unexpected error occurred during booking."
      : "Une erreur inattendue est survenue lors de la reservation."
    messageType.value = "error"
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  await loadPrestataire()
  await loadAvailability()
})

watch(() => route.params.username, async () => {
  await loadPrestataire()
  await loadAvailability()
  resetSelection()
})
</script>

<style scoped>
.reservation-page { padding: 20px; }
.titre { text-align: center; padding: 20px; }
.calendar-container { display:flex; justify-content:center; }
.calendar { width:min(760px, 100%); background:#fff; border-radius:18px; padding:24px; box-shadow:0 10px 25px rgba(0,0,0,0.08); }
.calendar__opts, .calendar__buttons { display:flex; gap:12px; justify-content:center; margin-bottom:16px; }
.calendar select, .calendar__button, .room-button, .validate-button { border:none; border-radius:10px; padding:12px 16px; font-size:14px; }
.calendar__body { display:flex; flex-direction:column; gap:10px; }
.calendar__days, .calendar__dates { display:grid; grid-template-columns:repeat(7, 1fr); gap:8px; }
.calendar__days > div { text-align:center; font-weight:600; color:#667; }
.calendar__date { min-height:56px; display:flex; align-items:center; justify-content:center; background:#eef3ff; border-radius:12px; cursor:pointer; }
.calendar__date--grey { background:#f2f2f2; color:#aaa; }
.calendar__date--selected { background:#5858d8; color:#fff; }
.calendar__button--grey { background:#ececec; }
.calendar__button--primary, .room-button, .validate-button { background:#5858d8; color:#fff; cursor:pointer; }
.reservation-panel { max-width:760px; margin:30px auto 0; display:grid; gap:18px; }
.card { background:#fff; border-radius:18px; padding:24px; box-shadow:0 10px 25px rgba(0,0,0,0.08); }
.status-card { padding-top: 18px; padding-bottom: 18px; }
.reservation-summary { margin-top:12px; color:#111; }
.reservation-summary p { margin:8px 0; color:#111; }
.reservation-code { margin-top:16px; padding:14px 16px; border:2px solid #d8defd; border-radius:12px; background:#f4f6ff; color:#2f2fb3; font-size:1rem; display:flex; justify-content:space-between; gap:12px; align-items:center; }
.availability-list { list-style:none; padding:0; margin:0 0 16px; display:grid; gap:10px; }
.availability-list li { display:flex; justify-content:space-between; gap:16px; }
.room-options { display:flex; gap:12px; flex-wrap:wrap; }
.room-button--selected { background:#2f2fb3; }
.validate-button[disabled] { opacity:0.6; cursor:not-allowed; }
.success { color:green; margin-top:12px; }
.error { color:#c40000; margin-top:12px; }
.empty-state { text-align:center; color:#666; margin-top:24px; }

@media (max-width: 700px) {
  .calendar__days, .calendar__dates { grid-template-columns:repeat(4, 1fr); }
}
</style>

<template>
  <div class="reservations-page">
    <div class="hero">
      <h1>{{ isEnglish ? 'My bookings' : 'Mes réservations' }}</h1>
      <p>
        {{ isEnglish
          ? 'Find all your booking codes and cancel a reservation if needed.'
          : 'Retrouvez tous vos codes de réservation et annulez facilement si besoin.' }}
      </p>
    </div>

    <div v-if="!auth.authUser" class="empty-card">
      {{ isEnglish ? 'Please log in to view your bookings.' : 'Connectez-vous pour consulter vos réservations.' }}
    </div>

    <template v-else>
      <p v-if="message" :class="['feedback', messageType]">{{ message }}</p>

      <div v-if="allReservations.length" class="reservations-grid">
        <article v-for="item in allReservations" :key="item.key" class="reservation-card">
          <div class="reservation-top">
            <span class="reservation-badge">{{ labelForKind(item.kind) }}</span>
            <span v-if="item.price !== undefined" class="reservation-price">{{ item.price }} EUR</span>
          </div>

          <h2>{{ item.title }}</h2>
          <p v-if="item.providerName" class="reservation-meta">{{ item.providerName }}</p>
          <p class="reservation-meta reservation-date">{{ item.dateLabel }}</p>
          <p v-if="item.location" class="reservation-meta">{{ item.location }}</p>

          <ul v-if="item.articles?.length" class="articles-list">
            <li v-for="article in item.articles" :key="article.id">
              {{ article.titre }} x{{ article.quantite }}
            </li>
          </ul>

          <div class="code-box">
            <span>{{ isEnglish ? 'Booking code' : 'Code de réservation' }}</span>
            <strong>{{ item.code }}</strong>
          </div>

          <button
            class="cancel-btn"
            :disabled="loadingKey === item.key"
            @click="cancel(item)"
          >
            {{ loadingKey === item.key
              ? (isEnglish ? 'Cancelling...' : 'Annulation...')
              : (isEnglish ? 'Cancel booking' : 'Annuler la réservation') }}
          </button>
        </article>
      </div>

      <div v-else class="empty-card">
        {{ isEnglish ? 'No bookings found yet.' : 'Aucune réservation trouvée pour le moment.' }}
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAuth } from '@/stores/auth.js'
import { useLanguageStore } from '@/stores/languageStore.js'
import HotelService from '@/services/hotel.service.js'

const auth = useAuth()
const languageStore = useLanguageStore()
const isEnglish = computed(() => languageStore.isEnglish)

const reservations = ref({
  competitions: [],
  spectators: [],
  planning: [],
  hotels: [],
  orders: []
})
const message = ref('')
const messageType = ref('success')
const loadingKey = ref('')

const allReservations = computed(() => [
  ...reservations.value.hotels,
  ...reservations.value.spectators,
  ...reservations.value.competitions,
  ...reservations.value.planning,
  ...reservations.value.orders
])

function labelForKind(kind) {
  if (isEnglish.value) {
    return {
      competition: 'Competition',
      spectator: 'Spectator seat',
      planning: 'Vendor event',
      hotel: 'Hotel',
      order: 'Order'
    }[kind] || kind
  }

  return {
    competition: 'Compétition',
    spectator: 'Place spectateur',
    planning: 'Prestataire',
    hotel: 'Hôtel',
    order: 'Commande'
  }[kind] || kind
}

async function loadReservations() {
  if (!auth.authUser?.username) return
  const result = await HotelService.getUserReservations(auth.authUser.username)
  if (result.error === 0) {
    reservations.value = result.data
  }
}

async function cancel(item) {
  const confirmed = window.confirm(
    isEnglish.value
      ? 'Do you really want to cancel this booking?'
      : 'Voulez-vous vraiment annuler cette réservation ?'
  )

  if (!confirmed) return

  loadingKey.value = item.key
  message.value = ''

  const result = await HotelService.cancelReservation({
    kind: item.kind,
    username: auth.authUser.username,
    payload: item.payload
  })

  if (result.error === 0) {
    messageType.value = 'success'
    message.value = isEnglish.value ? 'Booking cancelled.' : 'Réservation annulée.'
    await loadReservations()
  } else {
    messageType.value = 'error'
    message.value = result.data || (isEnglish.value ? 'Cancellation failed.' : "L'annulation a échoué.")
  }

  loadingKey.value = ''
}

onMounted(loadReservations)
</script>

<style scoped>
.reservations-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 20px 48px;
  color: #1f2f5c;
}

.hero {
  margin-bottom: 28px;
  padding: 28px;
  border-radius: 24px;
  background: linear-gradient(135deg, #eef3ff 0%, #dfe9ff 100%);
  border: 1px solid #d4def8;
}

.hero h1 {
  margin: 0 0 8px;
  color: #2447c6;
}

.hero p,
.reservation-meta {
  margin: 0;
}

.reservation-date {
  color: #d73f48;
  font-weight: 700;
}

.feedback {
  margin-bottom: 18px;
  padding: 14px 16px;
  border-radius: 14px;
}

.feedback.success {
  background: #edf4ff;
  color: #2042b2;
}

.feedback.error {
  background: #ffecec;
  color: #b12626;
}

.reservations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
}

.reservation-card,
.empty-card {
  background: #fff;
  border: 1px solid #d9e3fb;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 12px 28px rgba(37, 74, 173, 0.08);
}

.reservation-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.reservation-badge {
  background: #eaf1ff;
  color: #2447c6;
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 700;
}

.reservation-price {
  color: #2447c6;
  font-weight: 700;
}

.reservation-card h2 {
  margin: 0 0 10px;
  color: #1d2f67;
  font-size: 1.2rem;
}

.reservation-meta + .reservation-meta {
  margin-top: 6px;
}

.articles-list {
  margin: 12px 0 0;
  padding-left: 18px;
  color: #38508d;
}

.code-box {
  margin-top: 16px;
  padding: 14px 16px;
  border: 2px solid #d6e0ff;
  border-radius: 14px;
  background: #f5f8ff;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  color: #2447c6;
}

.cancel-btn {
  margin-top: 16px;
  width: auto;
  min-width: 180px;
  align-self: flex-start;
  border: none;
  border-radius: 12px;
  background: #d73f48;
  color: white;
  padding: 11px 16px;
  font-weight: 700;
  cursor: pointer;
}

.cancel-btn:disabled {
  opacity: 0.7;
  cursor: wait;
}
</style>

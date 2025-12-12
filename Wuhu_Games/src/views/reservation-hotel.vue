<template>
  <div>
    <div class="titre">
      <h1>Réserver</h1>
      <h2>Choisissez vos dates de début / fin de séjour</h2>
    </div>

    <div class="calendar-container">
      <div class="calendar">
        <div class="calendar__opts">
          <select name="calendar__month" id="calendar__month" disabled>
            <option selected>Mai</option>
          </select>

          <select name="calendar__year" id="calendar__year" disabled>
            <option selected>2025</option>
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
                day.grey && 'calendar__date--grey',
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
            Back
          </button>

          <button class="calendar__button calendar__button--primary" @click="applySelection">
            Apply
          </button>
        </div>
      </div>
    </div>

    <!-- Panneau de réservation sous le calendrier -->
    <div class="reservation-panel" v-if="availabilityInfo">
      <!-- Disponibilités -->
      <div class="card availability-card">
        <h3>Disponibilités</h3>

        <p class="date-range">
          <span v-if="availabilityInfo.mode === 'single'">
            Pour le <strong>{{ formatDateFr(availabilityInfo.startDate) }}</strong>
          </span>
          <span v-else>
            Du <strong>{{ formatDateFr(availabilityInfo.startDate) }}</strong>
            au <strong>{{ formatDateFr(availabilityInfo.endDate) }}</strong>
            ({{ availabilityInfo.nights }} nuit<span v-if="availabilityInfo.nights > 1">s</span>)
          </span>
        </p>

        <p class="hint">
          <span v-if="availabilityInfo.mode === 'single'">
            Chambres disponibles pour cette nuit :
          </span>
          <span v-else>
            Nombre minimum de chambres disponibles sur toute la période :
          </span>
        </p>

        <ul class="availability-list">
          <li>
            <strong>Chambre lit simple :</strong>
            <span>{{ availabilityInfo.simple }}</span>
          </li>
          <li>
            <strong>Chambre lit double :</strong>
            <span>{{ availabilityInfo.double }}</span>
          </li>
        </ul>

        <p class="prices-title">Prix par nuit</p>
        <ul class="availability-list">
          <li>
            <span>Lit simple</span>
            <span>{{ availabilityInfo.priceSimple }} €</span>
          </li>
          <li>
            <span>Lit double</span>
            <span>{{ availabilityInfo.priceDouble }} €</span>
          </li>
        </ul>

        <!-- Choix du type de chambre -->
        <div class="room-options">
          <button
            class="room-button"
            :class="{ 'room-button--selected': selectedRoomType === 'simple' }"
            :disabled="availabilityInfo.simple === 0"
            @click="chooseRoom('simple')"
          >
            Chambre lit simple
          </button>
          <button
            class="room-button"
            :class="{ 'room-button--selected': selectedRoomType === 'double' }"
            :disabled="availabilityInfo.double === 0"
            @click="chooseRoom('double')"
          >
            Chambre lit double
          </button>
        </div>
      </div>

      <!-- Récapitulatif -->
      <div v-if="recap" class="card recap-card">
        <h3>Récapitulatif de votre séjour</h3>

        <p class="recap-dates">
          Du <strong>{{ formatDateFr(recap.startDate) }}</strong>
          au <strong>{{ formatDateFr(recap.endDate) }}</strong>
          – {{ recap.nights }} nuit<span v-if="recap.nights > 1">s</span>
        </p>

        <p class="recap-room">
          Type de chambre :
          <strong v-if="recap.roomType === 'simple'">Lit simple</strong>
          <strong v-else>Lit double</strong>
        </p>

        <div class="recap-prices">
          <div>
            <span>Prix par nuit</span>
            <strong>{{ recap.pricePerNight }} €</strong>
          </div>
          <div v-if="recap.nights > 1">
            <span>Total pour {{ recap.nights }} nuit<span v-if="recap.nights > 1">s</span></span>
            <strong>{{ recap.total }} €</strong>
          </div>
        </div>

        <button class="validate-button" @click="validateOrder">
          Valider ma commande
        </button>
      </div>

      <!-- Numéro de commande -->
      <div v-if="orderId" class="card order-card">
        <h3>Merci pour votre réservation !</h3>
        <p>Votre numéro de commande :</p>
        <p class="order-id">{{ orderId }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import availability from '@/datasource/availability.json';

// Jours affichés dans le calendrier (mois de mai 2025, avec les 2 semaines d'événement 11–24)
const days = [
  // Avril (grisés)
  { label: 27, date: '2025-04-27', disabled: true, grey: true },
  { label: 28, date: '2025-04-28', disabled: true, grey: true },
  { label: 29, date: '2025-04-29', disabled: true, grey: true },
  { label: 30, date: '2025-04-30', disabled: true, grey: true },

  // 1–10 mai (affichés mais non réservables)
  { label: 1, date: '2025-05-01', disabled: true, grey: true },
  { label: 2, date: '2025-05-02', disabled: true, grey: true },
  { label: 3, date: '2025-05-03', disabled: true, grey: true },
  { label: 4, date: '2025-05-04', disabled: true, grey: true },
  { label: 5, date: '2025-05-05', disabled: true, grey: true },
  { label: 6, date: '2025-05-06', disabled: true, grey: true },
  { label: 7, date: '2025-05-07', disabled: true, grey: true },
  { label: 8, date: '2025-05-08', disabled: true, grey: true },
  { label: 9, date: '2025-05-09', disabled: true, grey: true },
  { label: 10, date: '2025-05-10', disabled: true, grey: true },

  // 11–24 mai : période de l'événement, cliquable
  { label: 11, date: '2025-05-11', disabled: false, grey: false },
  { label: 12, date: '2025-05-12', disabled: false, grey: false },
  { label: 13, date: '2025-05-13', disabled: false, grey: false },
  { label: 14, date: '2025-05-14', disabled: false, grey: false },
  { label: 15, date: '2025-05-15', disabled: false, grey: false },
  { label: 16, date: '2025-05-16', disabled: false, grey: false },
  { label: 17, date: '2025-05-17', disabled: false, grey: false },
  { label: 18, date: '2025-05-18', disabled: false, grey: false },
  { label: 19, date: '2025-05-19', disabled: false, grey: false },
  { label: 20, date: '2025-05-20', disabled: false, grey: false },
  { label: 21, date: '2025-05-21', disabled: false, grey: false },
  { label: 22, date: '2025-05-22', disabled: false, grey: false },
  { label: 23, date: '2025-05-23', disabled: false, grey: false },
  { label: 24, date: '2025-05-24', disabled: false, grey: false },

  // 25–31 mai (non réservables)
  { label: 25, date: '2025-05-25', disabled: true, grey: true },
  { label: 26, date: '2025-05-26', disabled: true, grey: true },
  { label: 27, date: '2025-05-27', disabled: true, grey: true },
  { label: 28, date: '2025-05-28', disabled: true, grey: true },
  { label: 29, date: '2025-05-29', disabled: true, grey: true },
  { label: 30, date: '2025-05-30', disabled: true, grey: true },
  { label: 31, date: '2025-05-31', disabled: true, grey: true }
];

const rangeStart = ref(null);
const rangeEnd = ref(null);

const availabilityInfo = ref(null);
const selectedRoomType = ref(null);
const orderId = ref(null);

const selectedDatesList = computed(() => {
  if (!rangeStart.value) return [];
  const start = rangeStart.value;
  const end = rangeEnd.value || rangeStart.value;
  const dates = [];
  let current = start;
  while (current <= end) {
    if (availability[current]) {
      dates.push(current);
    }
    current = getNextDate(current);
  }
  return dates;
});

function getNextDate(dateStr) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function onDayClick(day) {
  if (day.disabled) return;

  // On modifie la sélection -> on reset les infos de réservation
  availabilityInfo.value = null;
  selectedRoomType.value = null;
  orderId.value = null;

  // Aucun début ou on avait déjà une plage complète -> on recommence une nouvelle plage
  if (!rangeStart.value || (rangeStart.value && rangeEnd.value)) {
    rangeStart.value = day.date;
    rangeEnd.value = null;
    return;
  }

  // Si on reclique sur le même jour, on reste sur une seule date
  if (day.date === rangeStart.value) {
    rangeEnd.value = null;
    return;
  }

  // Si on clique sur un jour avant le début, on inverse
  if (day.date < rangeStart.value) {
    rangeEnd.value = rangeStart.value;
    rangeStart.value = day.date;
  } else {
    rangeEnd.value = day.date;
  }
}

function isSelected(date) {
  if (!rangeStart.value) return false;
  if (!rangeEnd.value) return date === rangeStart.value;
  return date >= rangeStart.value && date <= rangeEnd.value;
}

function isRangeStart(date) {
  return rangeStart.value && date === rangeStart.value;
}

function isRangeEnd(date) {
  return rangeEnd.value && date === rangeEnd.value && rangeEnd.value !== rangeStart.value;
}

function applySelection() {
  if (!selectedDatesList.value.length) {
    availabilityInfo.value = null;
    selectedRoomType.value = null;
    orderId.value = null;
    return;
  }

  const dates = selectedDatesList.value;
  const nights = dates.length;

  if (nights === 1) {
    const data = availability[dates[0]];
    if (!data) {
      availabilityInfo.value = null;
      return;
    }
    availabilityInfo.value = {
      mode: 'single',
      startDate: dates[0],
      endDate: dates[0],
      nights,
      simple: data.simple,
      double: data.double,
      priceSimple: data.priceSimple,
      priceDouble: data.priceDouble
    };
  } else {
    let minSimple = Infinity;
    let minDouble = Infinity;
    let priceSimple = null;
    let priceDouble = null;

    dates.forEach((d, index) => {
      const data = availability[d];
      if (!data) return;
      if (data.simple < minSimple) minSimple = data.simple;
      if (data.double < minDouble) minDouble = data.double;
      if (index === 0) {
        priceSimple = data.priceSimple;
        priceDouble = data.priceDouble;
      }
    });

    availabilityInfo.value = {
      mode: 'range',
      startDate: dates[0],
      endDate: dates[dates.length - 1],
      nights,
      simple: minSimple === Infinity ? 0 : minSimple,
      double: minDouble === Infinity ? 0 : minDouble,
      priceSimple,
      priceDouble
    };
  }

  selectedRoomType.value = null;
  orderId.value = null;
}

function chooseRoom(type) {
  if (!availabilityInfo.value) return;
  selectedRoomType.value = type;
}

const recap = computed(() => {
  if (!availabilityInfo.value || !selectedRoomType.value) return null;

  const nights = availabilityInfo.value.nights;
  const pricePerNight =
    selectedRoomType.value === 'simple'
      ? availabilityInfo.value.priceSimple
      : availabilityInfo.value.priceDouble;

  if (!pricePerNight) return null;

  return {
    roomType: selectedRoomType.value,
    nights,
    pricePerNight,
    total: nights * pricePerNight,
    startDate: availabilityInfo.value.startDate,
    endDate: availabilityInfo.value.endDate
  };
});

function generateOrderId() {
  const now = new Date();

  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');

  // random hex 4 chars (0000 → FFFF)
  const random = Math.floor(Math.random() * 0xffff)
    .toString(16)
    .toUpperCase()
    .padStart(4, '0');

  return `CMD-${yy}${mm}${dd}-${hh}${min}-${random}`;
}


function validateOrder() {
  if (!recap.value) return;
  //orderId.value = `CMD-${Date.now().toString().slice(-6)}`;
  orderId.value = generateOrderId();
}

function resetSelection() {
  rangeStart.value = null;
  rangeEnd.value = null;
  availabilityInfo.value = null;
  selectedRoomType.value = null;
  orderId.value = null;
}

function formatDateFr(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}
</script>

<style>
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

/* calendrier */
.calendar {
  --side-padding: 20px;
  --border-radius: 34px;
  --accent-br: 15px;
  width: 400px;
}
.calendar select {
  background-color: #f3f4f6;
  padding: 15px 20px;
}
.calendar__opts,
.calendar__buttons {
  background-color: #fff;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 15px;
}
.calendar__opts {
  border-top-left-radius: var(--border-radius);
  border-top-right-radius: var(--border-radius);
  padding: 20px var(--side-padding);
}
.calendar__body {
  background-image: linear-gradient(to bottom, #f3f4f6, #fff);
}
.calendar__days {
  background-color: #fff;
  padding: 0 var(--side-padding) 10px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}
.calendar__days > div {
  text-align: center;
  font-weight: 700;
  font-size: 1.02rem;
  color: #c5c8ca;
}
.calendar__dates {
  padding: 10px var(--side-padding);
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}
.calendar__date {
  --height: calc(400px / 6 - var(--side-padding));
  text-align: center;
  height: var(--height);
  line-height: var(--height);
  font-weight: 600;
  font-size: 1.02rem;
  cursor: pointer;
  position: relative;
}
.calendar__date::before {
  content: '';
  position: absolute;
  background-color: rgba(255, 255, 255, 0);
  width: 100%;
  height: calc(var(--height) * 0.9);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: var(--accent-br);
  transition: background-color 0.3s ease;
}
.calendar__date:not(.calendar__date--selected):not(.calendar__date--grey):hover::before {
  background-color: #ededed;
}
.calendar__date--grey {
  color: #c5c8ca;
  cursor: not-allowed;
}
.calendar__date--grey span {
  text-decoration: line-through;
  opacity: 0.6;
}

.calendar__date--selected {
  color: #ff374b;
}
.calendar__date--selected::before {
  background-color: #ffeaec;
  border-radius: 0px;
}
.calendar__date--first-date::before {
  border-top-left-radius: var(--accent-br);
  border-bottom-left-radius: var(--accent-br);
}
.calendar__date--last-date::before {
  border-top-right-radius: var(--accent-br);
  border-bottom-right-radius: var(--accent-br);
}
.calendar__date--range-start::after {
  content: '';
  position: absolute;
  bottom: 3px;
  border-radius: 24px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #ff374b;
  width: 10px;
  height: 4px;
}
.calendar__date--range-end {
  color: #fff;
}
.calendar__date--range-end::before {
  box-shadow: 0 15px 20px -3px rgba(255, 55, 75, 0.35);
  background-color: #ff374b;
  border-radius: var(--accent-br);
  z-index: 1;
}
.calendar__date--range-end::after {
  content: '';
  position: absolute;
  height: calc(var(--height) * 0.9);
  background-color: #ffeaec;
  width: 50px;
  top: 50%;
  right: 50%;
  transform: translateY(-50%);
}
.calendar__date span {
  position: relative;
  z-index: 1;
}
.calendar__buttons {
  padding: 10px var(--side-padding) 20px;
  border-bottom-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
}
.calendar__button {
  cursor: pointer;
}
.calendar__button--grey {
  background-color: #f3f4f6;
}
.calendar__button--primary {
  background-color: #1752ff;
  color: #fff;
  transition: box-shadow 0.3s cubic-bezier(0.21, 0.68, 0.09, 0.27), transform 0.2s linear;
}
.calendar__button--primary:hover {
  box-shadow: 0 20px 30px -13px rgba(23, 82, 255, 0.45);
  transform: translateY(-3px);
}
.calendar__button--primary:active {
  box-shadow: 0 10px 10px -6px rgba(23, 82, 255, 0.45);
  transform: translateY(-1px);
}

.calendar-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

body {
  display: grid;
  place-items: center;
  background-color: #eaedf2;
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
}

select,
button {
  font-family: inherit;
  font-weight: 700;
  font-size: 1.02rem;
  border-radius: 20px;
  outline: none;
  border: 0;
  padding: 15px 20px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

select {
  background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='960px' height='560px' viewBox='0 0 960 560' enable-background='new 0 0 960 560' xml:space='preserve'%3E%3Cg id='Rounded_Rectangle_33_copy_4_1_'%3E%3Cpath d='M480,344.181L268.869,131.889c-15.756-15.859-41.3-15.859-57.054,0c-15.754,15.857-15.754,41.57,0,57.431l237.632,238.937 c8.395,8.451,19.562,12.254,30.553,11.698c10.993,0.556,22.159-3.247,30.555-11.698l237.631-238.937 c15.756-15.86,15.756-41.571,0-57.431s-41.299-15.859-57.051,0L480,344.181z'/%3E%3C/g%3E%3C/svg%3E");
  background-size: 24px;
  background-repeat: no-repeat;
  background-position: calc(100% - var(--side-padding)) center;
}

/* Panneau de réservation façon "Airbnb" */

.reservation-panel {
  max-width: 600px;
  margin: 40px auto;
  padding: 0 20px 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card {
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.08);
  padding: 20px 24px;
}

.card h3 {
  margin: 0 0 10px;
  font-size: 1.3rem;
}

.date-range,
.hint {
  margin: 4px 0;
  color: #555;
}

.availability-list {
  list-style: none;
  padding: 0;
  margin: 10px 0 15px;
}
.availability-list li {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
}

.prices-title {
  margin-top: 10px;
  font-weight: 600;
}

.room-options {
  display: flex;
  gap: 10px;
  margin-top: 15px;
  flex-wrap: wrap;
}

.room-button {
  flex: 1;
  background: #f7f7f7;
  border-radius: 999px;
  padding: 10px 14px;
  border: 1px solid transparent;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;
}
.room-button:hover:not(:disabled) {
  background: #f0f0f0;
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
}
.room-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.room-button--selected {
  background: #ff385c;
  color: #fff;
  border-color: #ff385c;
  box-shadow: 0 10px 24px rgba(255, 56, 92, 0.35);
}

.recap-card .recap-dates {
  margin: 6px 0 8px;
}
.recap-card .recap-room {
  margin: 4px 0 12px;
}

.recap-prices {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 16px;
}
.recap-prices > div span {
  display: block;
  color: #555;
  font-size: 0.9rem;
}
.recap-prices > div strong {
  font-size: 1.05rem;
}

.validate-button {
  width: 100%;
  background: #ff385c;
  color: #fff;
  border-radius: 999px;
  font-size: 1rem;
  padding: 12px 18px;
  cursor: pointer;
  border: none;
  box-shadow: 0 12px 26px rgba(255, 56, 92, 0.35);
  transition: transform 0.1s ease, box-shadow 0.15s ease;
}
.validate-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 32px rgba(255, 56, 92, 0.4);
}
.validate-button:active {
  transform: translateY(0);
  box-shadow: 0 10px 20px rgba(255, 56, 92, 0.3);
}

.order-card p {
  margin: 4px 0;
}
.order-id {
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin-top: 6px;
}
</style>

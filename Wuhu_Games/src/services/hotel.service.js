import api from "@/services/axios.service.js"

const useSQL = true

export async function getHotelAvailability(prestataireUsername) {
  if (!useSQL) {
    const templates = JSON.parse(localStorage.getItem("templates") || "[]")
    const hotel = templates.find(t => t.username === prestataireUsername)
    return { error: 0, status: 200, data: hotel?.hotelAvailability || [] }
  }

  const res = await api.get(`/hotels/${prestataireUsername}/availability`)
  return res.data
}

export async function saveHotelAvailability(prestataireUsername, availability) {
  if (!useSQL) {
    const templates = JSON.parse(localStorage.getItem("templates") || "[]")
    const index = templates.findIndex(t => t.username === prestataireUsername)
    if (index !== -1) {
      templates[index].hotelAvailability = availability
      localStorage.setItem("templates", JSON.stringify(templates))
    }
    return { error: 0, status: 200, data: "Disponibilites enregistrees" }
  }

  const res = await api.put(`/hotels/${prestataireUsername}/availability`, { availability })
  return res.data
}

export async function createHotelReservation(payload) {
  if (!useSQL) {
    return { error: 0, status: 201, data: payload }
  }

  const res = await api.post("/hotels/reservation", payload)
  return res.data
}

export default {
  getHotelAvailability,
  saveHotelAvailability,
  createHotelReservation
}

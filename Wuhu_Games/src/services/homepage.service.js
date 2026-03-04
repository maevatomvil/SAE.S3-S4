const useSQL = true
const KEY = "homepageContent"

import api from "@/services/axios.service.js"

export async function getHomePage() {
  if (!useSQL) {
    const data = JSON.parse(localStorage.getItem(KEY) || '{}')
    return { error: 0, status: 200, data }
  } else {
    const res = await api.get("/homepage")
    return res.data
  }
}

export async function saveHomePage(content) {
  if (!useSQL) {
    localStorage.setItem(KEY, JSON.stringify(content))
    return { error: 0, status: 200, data: content }
  } else {
    const res = await api.put("/homepage", content)
    return res.data
  }
}

export default {
  getHomePage,
  saveHomePage
}

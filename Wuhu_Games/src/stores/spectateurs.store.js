import { defineStore } from "pinia"
import { getSpectateursList } from "@/services/localsource.service.js"
import { useCompetitions } from "./competitions.js"

export const useSpectateurs = defineStore("spectateurs", {
  state: () => ({
    spectateursUser: []
  }),

  actions: {
    async getSpectateurs() {
      const competitions = useCompetitions().compUser
      this.spectateursUser = []

      for (const c of competitions) {
        const list = await getSpectateursList(c)

        this.spectateursUser.push({
          titre: c.titre,
          jour: c.jour,
          heure: c.heure,
          spectateurs: list  
        })
      }
    }
  }
})

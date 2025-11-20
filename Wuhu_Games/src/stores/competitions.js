import {ref} from 'vue'
import {defineStore} from 'pinia'

import CompetitionsService from "@/services/competitions.service";

export const useCompetitions = defineStore('competitions', () => {
    const compUser = ref(null)

    async function getCompetitions(data) {
        console.log('login');
        let response = await CompetitionsService.getCompetitions(data)
        if (response.error == 0) {
            const savedCompetitions = JSON.parse(localStorage.getItem('competitions')) || []
            const merged = [...response.data, ...savedCompetitions.filter(c => !response.data.some(r => r.titre === c.titre && r.jour === c.jour && r.heure === c.heure))]
            compUser.value = merged
        } else {
            throw new Error(response.data)
        }
    }


    return {getCompetitions, compUser}
})
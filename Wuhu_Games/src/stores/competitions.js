import {ref} from 'vue'
import {defineStore} from 'pinia'

import CompetitionsService from "@/services/competitions.service";

export const useCompetitions = defineStore('competitions', () => {
    const compUser = ref(null)

    async function getCompetitions(data) {
        console.log('login');
        let response = await CompetitionsService.getCompetitions(data)
        if (response.error == 0) {
            compUser.value = response.data
        } else {
            throw new Error(response.data)
        }
    }

    return {getCompetitions, compUser}
})

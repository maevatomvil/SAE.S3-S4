import LocalSource from "@/services/localsource.service.js";

async function getCompetitionsFromLocalSource(data) {
    return LocalSource.getCompetitions(data);
}

async function getCompetitions(data) {
    let response = null;
    try {
        response = await getCompetitionsFromLocalSource(data);
    } catch(err) {
        response = {error: 1, status: 404, data: 'erreur réseau, impossible de récupérer les compétitions' }
    }
    return response
}

export default {
    getCompetitions
}

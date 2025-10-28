
const useSQL = false;


import competitions from '@/datasource/competitions.json'


export async function getCompetitions() {
  if (!useSQL) return competitions
  else {
    const sql = 'SELECT jour, heure, titre, lieu FROM competitions'
    const data = await executeSQL(sql)
    return data
  }
}


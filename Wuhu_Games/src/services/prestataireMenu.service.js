import TemplateService from './template.service.js'

const useSQL = false

export async function getPrestatairesValides() {
  if (!useSQL) {
    const templates = JSON.parse(localStorage.getItem('templates') || '[]')
    const valides = templates.filter(t => t.type === 'prestataireValide')
    return { error: 0, status: 200, data: valides }
  } else {
    const sql = "SELECT * FROM templates WHERE type = 'prestataireValide'"
    const datas = await executeSQL(sql)
    return { error: 0, status: 200, data: datas }
  }
}

export default { getPrestatairesValides }

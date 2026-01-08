const useSQL = false
const KEY = "homepageContent"

export async function getHomePage() {
  if (!useSQL) {
    const data = JSON.parse(localStorage.getItem(KEY) || '{}')
    return { error: 0, status: 200, data }
  } else {
    const sql = "SELECT * FROM homepage LIMIT 1"
    const datas = await executeSQL(sql)
    return { error: 0, status: 200, data: datas[0] }
  }
}

export async function saveHomePage(content) {
  if (!useSQL) {
    localStorage.setItem(KEY, JSON.stringify(content))
    return { error: 0, status: 200, data: content }
  } else {
    const sql = `
      UPDATE homepage 
      SET subtitleFr = ?, subtitleEn = ?, contentFr = ?, contentEn = ?
      WHERE id = 1
    `
    await executeSQL(sql, [
      content.subtitleFr,
      content.subtitleEn,
      content.contentFr,
      content.contentEn
    ])
    return { error: 0, status: 200, data: content }
  }
}

export default {
  getHomePage,
  saveHomePage
}

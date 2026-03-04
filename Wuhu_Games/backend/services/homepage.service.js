import { executeSQL } from "../database/db.js"

async function ensureHomepageTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS homepage (
      id INT PRIMARY KEY,
      subtitleFr TEXT,
      subtitleEn TEXT,
      contentFr MEDIUMTEXT,
      contentEn MEDIUMTEXT
    )
  `
  await executeSQL(sql)
}

function parseHomepageContent(contentFr, contentEn) {
  try {
    const parsed = JSON.parse(contentFr || "{}")
    if (
      typeof parsed === "object" &&
      (parsed.beforeFr !== undefined ||
        parsed.beforeEn !== undefined ||
        parsed.afterFr !== undefined ||
        parsed.afterEn !== undefined)
    ) {
      return {
        beforeFr: parsed.beforeFr ?? "",
        beforeEn: parsed.beforeEn ?? "",
        afterFr: parsed.afterFr ?? "",
        afterEn: parsed.afterEn ?? ""
      }
    }
  } catch {
    // Legacy format: plain text/html values in contentFr/contentEn
  }

  return {
    beforeFr: contentFr ?? "",
    beforeEn: contentEn ?? "",
    afterFr: "",
    afterEn: ""
  }
}

export async function getHomePageSQL() {
  await ensureHomepageTable()
  const rows = await executeSQL("SELECT * FROM homepage WHERE id = 1 LIMIT 1")
  const row = rows[0]

  if (!row) {
    return { error: 0, status: 200, data: {} }
  }

  const content = parseHomepageContent(row.contentFr, row.contentEn)

  return {
    error: 0,
    status: 200,
    data: {
      subtitleFr: row.subtitleFr ?? "",
      subtitleEn: row.subtitleEn ?? "",
      ...content
    }
  }
}

export async function saveHomePageSQL(content) {
  await ensureHomepageTable()
  const payload = JSON.stringify({
    beforeFr: content.beforeFr ?? "",
    beforeEn: content.beforeEn ?? "",
    afterFr: content.afterFr ?? "",
    afterEn: content.afterEn ?? ""
  })

  const sql = `
    INSERT INTO homepage (id, subtitleFr, subtitleEn, contentFr, contentEn)
    VALUES (1, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      subtitleFr = VALUES(subtitleFr),
      subtitleEn = VALUES(subtitleEn),
      contentFr = VALUES(contentFr),
      contentEn = VALUES(contentEn)
  `

  await executeSQL(sql, [
    content.subtitleFr ?? "",
    content.subtitleEn ?? "",
    payload,
    ""
  ])

  return { error: 0, status: 200, data: content }
}

export default {
  getHomePageSQL,
  saveHomePageSQL
}

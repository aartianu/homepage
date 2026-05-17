const { createClient } = require("@libsql/client");

const stateId = "default";

function getClient() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    throw new Error("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN.");
  }

  return createClient({ url, authToken });
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

async function ensureSchema(client) {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS homepage_state (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);
}

module.exports = async function handler(req, res) {
  try {
    const client = getClient();
    await ensureSchema(client);

    if (req.method === "GET") {
      const result = await client.execute({
        sql: "SELECT data, updated_at FROM homepage_state WHERE id = ?",
        args: [stateId]
      });
      const row = result.rows[0];
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(row ? { data: JSON.parse(row.data), updatedAt: row.updated_at } : { data: null }));
      return;
    }

    if (req.method === "POST") {
      const writeSecret = process.env.HOMEPAGE_WRITE_SECRET;
      if (writeSecret && req.headers["x-homepage-secret"] !== writeSecret) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Missing or invalid sync secret." }));
        return;
      }

      const body = await readBody(req);
      const updatedAt = new Date().toISOString();
      await client.execute({
        sql: `
          INSERT INTO homepage_state (id, data, updated_at)
          VALUES (?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at
        `,
        args: [stateId, JSON.stringify(body.data || {}), updatedAt]
      });

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ ok: true, updatedAt }));
      return;
    }

    res.statusCode = 405;
    res.setHeader("Allow", "GET, POST");
    res.end(JSON.stringify({ error: "Method not allowed." }));
  } catch (error) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: error.message }));
  }
};

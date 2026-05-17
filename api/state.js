const { createClient } = require("@libsql/client");

const rowId = "default";

const stores = [
  {
    key: "aarti.homepage.document",
    table: "homepage_legacy_document",
    fallback: ""
  },
  {
    key: "aarti.homepage.folders",
    table: "homepage_folders",
    fallback: "[]"
  },
  {
    key: "aarti.homepage.todos",
    table: "homepage_todos",
    fallback: "[]"
  },
  {
    key: "aarti.homepage.events",
    table: "homepage_events",
    fallback: "{}"
  },
  {
    key: "aarti.homepage.song",
    table: "homepage_song",
    fallback: ""
  }
];

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
  await Promise.all(stores.map((store) => client.execute(`
    CREATE TABLE IF NOT EXISTS ${store.table} (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `)));
}

async function readState(client) {
  const state = {};
  const rows = await Promise.all(stores.map(async (store) => {
    const result = await client.execute({
      sql: `SELECT data FROM ${store.table} WHERE id = ?`,
      args: [rowId]
    });
    return [store.key, result.rows[0]?.data ?? null];
  }));

  rows.forEach(([key, value]) => {
    if (value !== null) state[key] = value;
  });

  return state;
}

async function readLegacyBlobState(client) {
  try {
    const result = await client.execute({
      sql: "SELECT data FROM homepage_state WHERE id = ?",
      args: [rowId]
    });
    const raw = result.rows[0]?.data;
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function writeState(client, state) {
  const updatedAt = new Date().toISOString();
  await Promise.all(stores.map((store) => {
    const value = typeof state[store.key] === "string" ? state[store.key] : store.fallback;
    return client.execute({
      sql: `
        INSERT INTO ${store.table} (id, data, updated_at)
        VALUES (?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at
      `,
      args: [rowId, value, updatedAt]
    });
  }));
  return updatedAt;
}

module.exports = async function handler(req, res) {
  try {
    const client = getClient();
    await ensureSchema(client);

    if (req.method === "GET") {
      let data = await readState(client);
      if (!Object.keys(data).length) {
        const legacyData = await readLegacyBlobState(client);
        if (legacyData && typeof legacyData === "object") {
          await writeState(client, legacyData);
          data = await readState(client);
        }
      }
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ data }));
      return;
    }

    if (req.method === "POST") {
      const body = await readBody(req);
      const updatedAt = await writeState(client, body.data || {});
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

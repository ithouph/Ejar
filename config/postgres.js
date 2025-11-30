import pg from 'pg';

const { Client } = pg;

let client = null;

export async function getPostgresClient() {
  if (client) return client;
  
  client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  
  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL');
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error.message);
    client = null;
    throw error;
  }
  
  return client;
}

export async function queryPostgres(sql, params = []) {
  try {
    const client = await getPostgresClient();
    const result = await client.query(sql, params);
    return result.rows;
  } catch (error) {
    console.error('PostgreSQL query error:', error.message);
    throw error;
  }
}

export async function queryPostgresSingle(sql, params = []) {
  const results = await queryPostgres(sql, params);
  return results[0] || null;
}

import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

let client = null;
let db = null;

export async function conectarDB() {
  if (db) return db;
  if (!uri) {
    console.warn('⚠️  MONGODB_URI não configurada');
    return null;
  }
  try {
    client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
    await client.connect();
    db = client.db('ahga');
    console.log('✅ Conectado ao MongoDB Atlas');
    return db;
  } catch (err) {
    console.error('❌ Erro ao conectar MongoDB:', err.message);
    return null;
  }
}

export function getDB() {
  return db;
}
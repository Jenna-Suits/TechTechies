import { MongoClient } from 'mongodb';

// your Atlas connection string in Vercel → Settings → Env Vars
const uri = process.env.MONGODB_URI;
let clientPromise;

if (!clientPromise) {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  clientPromise = client.connect();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password } = req.body;
  const client = await clientPromise;
  const db = client.db('TechiesCluster');   // use your DB name
  const user = await db.collection('users')
                       .findOne({ accountID: username });
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.status(200).json({ message: 'OK' });
}
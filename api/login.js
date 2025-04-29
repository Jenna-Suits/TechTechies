import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
// cache the client across invocations
let clientPromise;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  // lazy-connect
  if (!clientPromise) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    clientPromise = client.connect();
  }
  const client = await clientPromise;
  const db = client.db('techies_dbs');  // replace with your actual DB

  const { username, password } = req.body;
  const user = await db
    .collection('users')
    .findOne({ accountID: username });

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  return res.status(200).json({ message: 'OK' });
}
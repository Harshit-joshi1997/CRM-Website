import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await client.connect();
  const db = client.db("dashboard");
  const tasks = db.collection("tasks");

  if (req.method === "GET") {
    const data = await tasks.find({}).toArray();
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const body = req.body;
    const result = await tasks.insertOne(body);
    return res.status(201).json(result);
  }

  if (req.method === "PATCH") {
    const { id, ...updates } = req.body;
    await tasks.updateOne({ _id: new ObjectId(id) }, { $set: updates });
    return res.status(200).json({ updated: true });
  }

  res.status(405).end(); // Method not allowed
}

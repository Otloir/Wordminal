import { MongoClient, ObjectId } from "mongodb";

import "dotenv/config";

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("MONGO_URI not set in .env");
}

let client;
let db;


//Creates a client if it doesn't exist
export async function connectDB(retries = 3) {
  if (!client) {
    client = new MongoClient(uri, {
      tls: true,
      serverSelectionTimeoutMS: 5000,
    });
  }

  //Feature that retries if a MongoDB connection fails
  for (let i = 0; i < retries; i++) {
    try {
      if (!db) await client.connect();
      db = client.db();
      return db;
    } catch (err) {
      console.warn(`MongoDB connection attempt ${i + 1} failed. Retrying...`);
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 1000)); 
    }
  }
}

//Converts string to ObjectId
export function toObjectId(id) {
  if (!id) throw new Error("Invalid id for ObjectId");
  return typeof id === "string" ? new ObjectId(id) : id;
}

//Insert helper for object id
export async function insert(collectionName, doc) {
  const database = await connectDB();
  const result = await database.collection(collectionName).insertOne(doc);
  return result.insertedId;
}

//Gets a random word by the difficulty name
export async function getRandomWordByDifficultyName(difficultyName) {
  const database = await connectDB();

  const [word] = await database.collection("words").aggregate([
    {
      $lookup: {
        from: "difficulties",
        localField: "difficultyId",
        foreignField: "_id",
        as: "difficulty"
      }
    },
    { $unwind: "$difficulty" },
    { $match: { "difficulty.name": difficultyName } },
    { $sample: { size: 1 } }
  ]).toArray();

  //Returns a word in the given difficulty and null if it doesn't find any
  return word ?? null;
}

import { MongoClient, ServerApiVersion } from "mongodb"
import { MONGODB_URI } from "../env"
 
if (!MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}
 
const uri = MONGODB_URI 
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
}
 
let client: MongoClient
 
if (process.env.NODE_ENV === "development") {
 
  let globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient
  }
 
  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options)
  }
  client = globalWithMongo._mongoClient
} else {

  client = new MongoClient(uri, options)
}
 

export default client
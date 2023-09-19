import { MongoClient } from 'mongodb'

const runtimeRuntime = useRuntimeConfig()

const mongoURI = runtimeRuntime.mongodbUri

let client = new MongoClient(mongoURI, {})
let clientPromise = client.connect()

export default clientPromise

import { MongoClient } from 'mongodb'

const mongoURI = 'mongodb://root:toor@localhost:27017'

let client = new MongoClient(mongoURI, {})
let clientPromise = client.connect()

export default clientPromise

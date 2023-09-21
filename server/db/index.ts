import { MongoClient } from 'mongodb'

const mongo = useRuntimeConfig().mongo

const mongoUri =
  `mongodb://${mongo.user}:${mongo.password}@${mongo.host.length ? mongo.host+'/' : '' }${mongo.db}
    ?authSource=admin&tls=${mongo.tlsEnabled}${mongo.caPath.length ? '&tlsCAFile=' + mongo.caPath : ''}`

let client = new MongoClient(mongoUri, {})
let clientPromise = client.connect()

export default clientPromise

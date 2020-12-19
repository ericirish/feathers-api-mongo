const { MongoClient } = require('mongodb')

module.exports = (app) => {
  const connection = app.get('mongodb')
  const database = connection.substr(connection.lastIndexOf('/') + 1)
  const mongoClient = MongoClient.connect(connection, { useNewUrlParser: true })
    .then((client) => client.db(database))

  app.set('mongoClient', mongoClient)
}

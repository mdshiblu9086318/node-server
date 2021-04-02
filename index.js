const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.adswp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json())
app.use(cors())


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const mealCollection = client.db("toTheMinute").collection("meal");


  app.post('/addMeal', (req, res) => {
    const meal = req.body
    mealCollection.insertOne(meal)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/meals', (req, res) => {
    mealCollection.find({})
      .toArray((error, documents) => {
        res.send(documents)
      })
  })

  app.get('/meal/:name', (req, res) => {
    mealCollection.find({ name: req.params.name })
      .toArray((error, documents) => {
        res.send(documents[0])
      })
  })

  app.post('/checkoutOrder', (req, res) => {
    const order = req.body;
    mealCollection.insertOne(order)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/order', (req, res) => {
    mealCollection.find({ email: req.query.email })
      .toArray((error, documents) => {
        res.send(documents)
      })
  })

  app.delete('/delete/:name', (req, res) => {
    mealCollection.deleteOne({ name: req.params.name })
      .then(result => {
        res.send(result.deletedCount > 0);
      })
  })

})

app.listen(port)
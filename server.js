var express = require('express')
var app = express()
var cors = require('cors')
var bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(cors())

app.post('/save', function (req, res) {
  console.log('Email:', req.body.email)
  res.sendStatus(200)
})

app.listen(process.env.PORT || 3200)

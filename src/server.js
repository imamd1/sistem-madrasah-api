const express = require('express')

const http = require('http');  // Tambahkan http module
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const cors = require('cors')
const errorHandler = require('../src/middleware/error_handler')

const userRoute = require('../src/api/users/routes')
const authRoute = require('../src/api/authentications/routes')

const app = express()
dotenv.config()
const server = http.createServer(app)


app.use(bodyParser.json())
app.use(cors({ origin: '*' }))
app.use(bodyParser.urlencoded({ extended: true }))


app.use(userRoute)
app.use(authRoute)

app.use(errorHandler)

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${[process.env.PORT]}`)
})
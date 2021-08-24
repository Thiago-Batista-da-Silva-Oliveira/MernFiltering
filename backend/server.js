require('dotenv').config()
const cors = require('cors')
const express = require('express')

const connectDB = require('./config/db')

const errorHandler = require("./middleware/errorHandler")

connectDB()

const app = express()

app.use(express.json())
app.use(cors())

app.use('/api/v1/bootcamps', require('./routes/bootcampRoutes'))

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`listening on port ${PORT}`))
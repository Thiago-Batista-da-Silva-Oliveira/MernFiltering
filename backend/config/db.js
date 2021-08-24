const mongoose = require('mongoose')

const connString = process.env.DATABASE_CONNECTION

const connectDB = async() => {
 try{
       await mongoose.connect(connString, {
           useCreateIndex: true,
           useFindAndModify: false,
           useUnifiedTopology: true,
           useNewURLParser: true,
       })

       console.log("MongoDB connection success")
 } catch(error){
         console.log(error)
         process.exit(1)
 }
}

module.exports = connectDB
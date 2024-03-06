require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const userRoutes = require('./routes/userRoutes')

 

const app = express()
const port = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL

//COrs policy
app.use(cors())
app.set("view engine", "ejs")


//Database connection
connectDB(DATABASE_URL)

//JSON
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/api/user',userRoutes)


const views = require("./routes/views/router")
app.use("/" , views)

 





app.listen(port,()=>{
    console.log(`Server listened at http://localhost:${port}`);
})
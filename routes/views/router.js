const express = require("express")
const route = express.Router()
const {signup,signin,resetlink,update, home}= require("../../controllers/views/controller")

route.get("/signup" , signup)
route.get('/signin', signin)
route.get('/resetlink',resetlink)
route.get('/update',update)
route.get('/home',home)


module.exports = route
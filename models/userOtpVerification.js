const mongoose = require('mongoose')
const Schema = new mongoose.Schema({
    userID:String,
    otp:String,
    createdAt:Date,
    expiresAt:Date,

})

const uOv = mongoose.model('Uov',Schema)
module.exports = uOv

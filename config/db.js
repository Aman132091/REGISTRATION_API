const mongoose = require('mongoose')
const connectDB = async(DATABASE_URL)=>{
    try {
        const DB_options = {
            dbName:"USER_DATA"
        }
        await mongoose.connect(DATABASE_URL,DB_options)
        console.log('Connected Successfully');
    } catch (error) {
        console.log('Not Connected',error);

        
    }

}

module.exports = connectDB
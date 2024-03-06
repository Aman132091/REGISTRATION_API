const jwt = require('jsonwebtoken')
const UserModel = require('../models/user')
// const { changePassword } = require('../controllers/userController')


const checkUserauth = async (req,res,next)=>{
    let token 
    const {authorization} = req.headers
    if(authorization && authorization.startsWith('Bearer')) {  //its frontend wrk checks in authorization there is any data presents or not
        try {
            //get token from header
            token = authorization.split(' ')[1]

            //verify the token
            const {userID} = jwt.verify(token,process.env.JWT_SECRETKEY)


            //get user from token
            req.user = await UserModel.findById(userID).select('-password')
            console.log(req.user);
            next()
        } catch (error) {
            console.log(error);
            res.status(401).send({"status":"failed","message":"Failed to Access"})
            
        }           
    
    
    
    }
    if(!token){
        res.status(401).send({"status":"failed","message":"For authorization need token!"})
    }

}   
module.exports = checkUserauth
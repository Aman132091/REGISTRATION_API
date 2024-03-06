const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const checkUserauth = require('../middleware/auth-middleware')

//middleware routes
router.use('/changepassword',checkUserauth)
router.use('/loggeduser',checkUserauth)




//Public Root 
router.post('/signup',userController.signup)
router.post('/signin',userController.signin)
router.post('/send-reset-password-link',userController.sndUserPsswrdLink)
router.post('/reset-password/:id/:token',userController.updatePassword)

// //protected routes
// router.post('/changepassword',userController.changePassword)
// router.use('/loggeduser',checkUserauth)  //checkl authenticate





//Protected Root(Access after login)
router.post('/changepassword',userController.changePassword)
router.get('/loggeduser',userController.loggedUser)  //data retrive


module.exports = router
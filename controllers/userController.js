// const userModel = require('../models/user')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const UserModel  = require('../models/user')
const transporter = require('../config/emailConfig')


//Home page
const home = async(req,res)=>{
    res.send("Welcome's you")
}
//SignUp API
const signup = async(req,res)=>{
    const {name,email,password} = req.body
    

    const user = await UserModel.findOne({email}) //match email present or not provided by user
    if (user) {
        res.send({"status":"failed","message":"Email already exists"})
        
    } else {
        if(name && email && password){
            try {
                const salt = await bcryptjs.genSalt(10)
                const hashPassword = await bcryptjs.hash(password,salt)
                const newUser = new UserModel({

                    name:name,
                    email:email,
                    password:hashPassword
                    

                })
                await newUser.save()
                const savedUser = await UserModel.findOne({email})

                //generate jwt token
                const token = jwt.sign({userID:savedUser._id},process.env.JWT_SECRETKEY,{expiresIn:'5d'})
                res.status(201).send({"status":"Success","message":"SignUp Successfully","token":token})

            } catch (error) {
                console.log('error:',error);
                res.send({"status":"failed","messgae":"Not Get All Information"})
                
            }
            
        }else{

            res.send({"status":"failed","message":"All Fields Are Required"})

        }
        
    }
}


//Login Api

const signin = async(req,res)=>{
    try {
        const{email,password} = req.body
        if(email&&password){
            const user = await UserModel.findOne({email})
            if(user){
                const isMatch = await bcryptjs.compare(password,user.password)
                if((user.email === email) && isMatch){
                    //Generate Jwt token
                    const token = jwt.sign({userID:user._id},process.env.JWT_SECRETKEY,{expiresIn:"5d"})
                    res.send({"status":"Success","message":"Login Successfully","token":token})
                    
                }else{
                    res.send({"status":"failed","message":"email or password does not matched"})
                }

            }else{
                res.send({"status":"failed","message":" ------------User not found ! ------------------------ "})
            }

        }else{
            res.send({"status":"failed","message":" Required All Feilds ! "})
        }
    } catch (error) {
        console.log(error);
        res.send({"status":"failed","message":"unable to use signin"})
        
    }

}
//change password

const changePassword = async(req,res)=>{
    const{password}=req.body
    if(password){
        if(!password){
            res.send({"status":"failed","message":"Password Does Not Matched"})
        }else{
            const salt = await bcryptjs.genSalt(10)
            const newHashPassword = await bcryptjs.hash(password,salt)
            await UserModel.findByIdAndUpdate(req.user._id,{set:{password: newHashPassword}})
            res.send({"status":"success","message":"Password Changed Successfully"})

        }

    }else{
        res.send({"status":"failed","message":"Password Field is required"})
    }

}

const loggedUser = async(req,res)=>{
    res.send({"user":req.user})
}

const sndUserPsswrdLink = async (req,res)=>{
    const {email} = req.body
    if(email){
        const user = await UserModel.findOne({email})
        if(user){
            const secret = user._id + process.env.JWT_SECRETKEY
            const token = jwt.sign({userID:user._id},secret,{expiresIn:'15m'})
            //Link send for reset password
            const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`

            // console.log(link);

            //send Email
            const info = await transporter.sendMail({
                from:process.env.EMAIL_FROM,
                to: user.email,
                subject:"Please Reset Your Password",
                html:`<a href=${link}>Click Here to reset your password</a>`
            })
            res.send({"status":"success","message":"Email sent --- please check your mail","info":info})
        }else{
            res.send({"status":"failed","message":"Email Not found"})
        }

    }else{
        res.send({"status":"failed","message":"Email field is required"})
    }
}

const updatePassword = async(req,res)=>{
    const {password}=req.body
    const{id,token}=req.params
    const user = await UserModel.findById(id)
    const newSecret = user._id + process.env.JWT_SECRETKEY
    try {
        jwt.verify(token,newSecret)            //verify token
        if(password){
            if(!password){
                res.send({"status":"failde","message":"not matched"})

            }else{
                const salt = await bcryptjs.genSalt(10)
                const newHashPassword = await bcryptjs.hash(password,salt)
                await UserModel.findByIdAndUpdate(user._id,{$set:{password:newHashPassword}})
                res.send({"status":"Success","message":"Password Updated Successfully"})
            }


        }else{
            res.send({"status":"failed","message":"this Field Required token"})
        }


    } catch (error) {
        console.log(error);
        res.send({"status":"failed","message":"Token Not verify!"})
        
    }
}
module.exports = {signup,signin,changePassword,loggedUser,sndUserPsswrdLink,updatePassword,home}











/*
document.getElementById('signup-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/user/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        if (response.ok) {
            alert('User created successfully');
        } else {
            alert('Error creating user');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});*/ 
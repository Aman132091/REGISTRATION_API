exports.home = async(req,res)=>{
    res.render('homepage')
}
exports.signup = async (req , res)=>{
    res.render('signup')
}

exports.signin = async(req,res)=>{
    res.render('signin')
}

exports.resetlink = async(req,res)=>{
    res.render('reset')
}

exports.update = async(req,res)=>{
    res.render('Update')
}
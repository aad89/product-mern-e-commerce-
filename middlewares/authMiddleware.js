const JWT = require("jsonwebtoken");
const User = require("../models/User")

module.exports.requiredSignin = async(req,res,next)=>{
    try{
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_TOKEN)
        req.user = decode;
        next();
    }catch(error){
        console.log(error)
    }
}

module.exports.isAdmin = async(req,res,next)=>{
    try{
        const user = await User.findById(req.user._id);
        if(user.role !== 1){
            return res.status(401).send({
                success: false,
                message: "Unauthorized Access"
            })
        } else{
            next();
        }
    }catch(error){
        console.log(error)
    }
}

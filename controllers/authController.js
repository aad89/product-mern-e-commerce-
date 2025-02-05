const { hashpassword, comparePassword } = require("../helpers/authHelper");
const orderModel = require("../models/orderModel");
const User = require("../models/User")
const JWT = require("jsonwebtoken")


const registerController = async(req,res)=> {
    try{
        const {name,email,password,phone,address,answer} = req.body;
        if(!name){
            return res.send({message: "name is required"})
        }
        if(!answer){
            return res.send({message: "Answer is required"})
        }
        if(!email){
            return res.send({message: "email is required"})
        }
        if(!password){
            return res.send({message: "password is required"})
        }
        if(!phone){
            return res.send({message: "phone no is required"})
        }
        if(!address){
            return res.send({message: "address no is required"})
        }

        const existinguser = await User.findOne({email})
        if(existinguser){
            return res.send("already regisered please login")
        }

        const hashedpassword = await hashpassword(password);
        const user = await new User({name, email,phone,address,password:hashedpassword, answer}).save();
        res.send({
            success: true,
            message: "User succesfully registered",
            user,
        })
    }catch(e){
        console.log(e)
    }
};


const loginController = async(req, res) =>{
    try{
        const{email,password} = req.body;
        if(!email || !password){
             res.status(404).send({
                success: false,
                message: "Invalid email or password"
            })
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).send({
                success:false,
                message:"email  is Not registered"
            })
        }
        const match = await comparePassword(password, user.password)
        if(!match){
            return res.status(200).send({
                success: false,
                message: "Invalid password"
            })
        }

        //token
        console.log(req.user)
        const token = await JWT.sign({_id:user._id}, process.env.JWT_TOKEN, {expiresIn:"7d"})
        res.status(200).send({
            success: true,
            message: "login successully",
            user:{
                _id: user._id,
                name:user.name,
                email: user.email,
                phone:user.phone,
                address:user.address,
                role: user.role,
            },
            token,
        })
        console.log(req.session);
    }catch(error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Login Failed",
            error
        });
}};

 const forgotPasswordController = async(req,res)=>{
    try{
        const {email, answer, newPassword}= req.body;
        if(!email){
            res.status(400).send({message: "Email is required"})
        }
        if(!answer){
            res.status(400).send({message: "Answer is required"})
        }
        if(!newPassword){
            res.status(400).send({message: "New Password is required"})
        };

        const user = await User.findOne({email, answer});

        if(!user){
            return res.status(400).send({
                success: false,
                message: "Wrong Email or Answer"
            })
        };
        const hashed = await hashpassword(newPassword)
        await User.findByIdAndUpdate(user._id, {password: hashed});
        res.status(200).send({
            success: true,
            message: "Password reset successfull"
        })
    }catch(error){
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Something went wrong",
            error
        })
    }
}

const updateProfileController = async(req,res)=>{
    try {
        const {name,email,password,phone,address} = req.body;
        const user = await User.findById(req.user._id);
        if(password && password.length < 6){
            return res.json({error: "Password is required and 6 characters long"})
        }
        const hashedPassword = password ? await hashpassword(password) : undefined;
        const updatedUser = await User.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address,
        }, {new:true});

        res.status(200).send({
            success: true,
            message: "Profile Updated Successfully",
            updatedUser
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error in profile update",
            error
        })
    }
}

const getOrdersController = async(req,res)=>{
    try{
        const orders = await orderModel.find({buyer: req.user._id}).populate("products", "-photo").populate("buyer", "name");
        res.json(orders);
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message: "Error in getting orders",
            error
        })
    }
}

const getAllOrdersController = async(req,res)=>{
    try{
        const orders = await orderModel.find({}).populate("products", "-photo").populate("buyer", "name").sort({createdAt: -1});
        res.json(orders);
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message: "Error in getting orders",
            error
        })
    }
}

const orderStatusController = async(req,res)=>{
    try {
        const {orderId} = req.params;
        const {status} = req.body;
        const orders = await orderModel.findByIdAndUpdate(orderId, {status}, {new: true});
        res.json(orders)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message: "Error in updating Status",
            error
        })
    }
}

const testController = (req,res)=>{
    res.send("protected route")
}


module.exports = {registerController,getAllOrdersController,orderStatusController,getOrdersController, loginController, testController, forgotPasswordController, updateProfileController};